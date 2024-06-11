"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import Input from "@/app/components/inputs/Input";
import SelectColors from "@/app/components/inputs/SelectColors";
import TextArea from "@/app/components/inputs/TextArea";
import firebaseApp from "@/libs/firebase";
import { ImageType, UploadedImageType } from "@/types";
import { categories } from "@/utils/categories";
import { colors } from "@/utils/colors";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import axios from "axios";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      inStock: false,
      images: [],
    },
  });

  // update images
  useEffect(() => {
    setCustomValue("images", images);
  }, [images]);

  // check if product created
  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated, reset]);

  // submit the formproduct
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("product  form data", data);
    //  upload images to firebase
    // save product in mongo db
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];
    if (!data.category) {
      setIsLoading(false);
      return toast.error("Category is not selected");
    }
    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error("No selected image");
    }
    const handleImagesUpload = async () => {
      // telling here we are loading because certain images are big
      toast("Creating Product ,Please Wait...");
      // uploading mulltiplle images
      try {
        for (const item of data.images) {
          if (item.image) {
            // to ensure that name of image is unique we add  date
            const fileName = new Date().getTime() + "-" + item.image.name;
            const storage = getStorage(firebaseApp)
            const storageRef = ref(storage, `products/${fileName}`)
            const uploadTask = uploadBytesResumable(storageRef, item.image)
            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                (error) => {
                  // Handle unsuccessful uploads
                  console.log('error uploading image', error)
                  reject(error)
                },
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    uploadedImages.push({
                      ...item,
                      image: downloadURL
                    })
                    resolve()
                  })
                    .catch((error) => {
                      console.log('error getting url ', error)
                      reject(error)
                    })
                }
              )
            })
          }
        }
        
      } catch (error) {
        setIsLoading(false)
        return toast.error('Error handling uploading image')
      }
    };
    await handleImagesUpload()
    const productData = { ...data, images: uploadedImages }
    console.log(productData, "product data fb")
    // save this product dreated in mongodb ,so call axios and endpoints to handle this 
    axios.post('/api/product', productData).then(() => {
      toast.success("product created")
      setIsProductCreated(true)
      router.refresh()
    }).catch((error) => {
      toast.error('something went wrong when saving product in db')
    }).finally(() => {
      setIsLoading(false)
    })
  };

  const category = watch("category");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);
  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter(
          (item) => item.color !== value.color
        );
        return filteredImages;
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product " center />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        type="number"
        errors={errors}
        required
      />
      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckbox
        id="inStock"
        register={register}
        label="This product already in stock"
      />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select Category</div>
        <div className=" grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">
          {/* mapping through categories */}
          {categories.map((item) => {
            if (item.label === "All") {
              return null;
            }
            return (
              <div key={item.label} className="col-span">
                <CategoryInput
                  onclick={(category) => setCustomValue("category", category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available product collors and upload them
          </div>
          <div className="text-sm">
            You must upload an image for each color selected other wise your
            color selection will be ignored
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {colors.map((item, index) => {
            return (
              <SelectColors
                key={index}
                item={item}
                addImageToState={addImageToState}
                removeImageFromState={removeImageFromState}
                isProductCreated={isProductCreated}
              />
            );
          })}
        </div>
      </div>
      <Button
        label={isLoading ? "Loading ..." : "Add Product"}
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default AddProductForm;
