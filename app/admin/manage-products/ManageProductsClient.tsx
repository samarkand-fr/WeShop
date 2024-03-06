"use client";

import { Product } from ".prisma/client";
import { formatPrice } from "@/utils/formatPrice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MdCached, MdClass, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";
import Status from "@/app/components/Status";
import ActionBtn from "@/app/components/ActionBtn";
import { useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import firebaseApp from "@/libs/firebase";
import Heading from "@/app/components/Heading";

interface ManageProductsClientProps {
  products: Product[];
}
const ManageProductsClient: React.FC<ManageProductsClientProps> = ({
  products,
}) => {
  const router = useRouter()
  const storage = getStorage(firebaseApp)

  let rows: any = [];
  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
      };
    });
  }
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 220,
    },
    {
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 100,
      // customize the style of price
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800 ">{params.row.price}</div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 100,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 100,
    },
    {
      field: "inStock",
      headerName: "InStock",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="font-bold text-slate-800 ">
            {params.row.inStock === true ? (
              <Status
                text="in stock"
                icon={MdDone}
                bg="bg-teal-200"
                color="text-teal-700"
              />
            ) : (
              <Status
                text="out of stock"
                icon={MdClass}
                bg="bg-rose-200"
                color="text-rose-700"
              />
            )}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return <div className="flex justify-between gap-4 w-full ">

          <ActionBtn icon={MdCached} onClick={() => {
            handleToggleStock(params.row.id, params.row.inStock)
        }}/>
          <ActionBtn icon={MdDelete} onClick={() => {
            handleDelete(params.row.id,params.row.images)
        }}/>
          <ActionBtn icon={MdRemoveRedEye} onClick={() => {
            router.push(`/product/${params.row.id}`)
        }}/>
        
        
        </div>;
      },
    },
  ];

  const handleToggleStock = useCallback((id:string,inStock : boolean) => {
    // updating resource in db  
    axios.put('/api/product', {
      id,
      inStock: !inStock
    }).then((res) => {
      toast.success('product status changed')
      router.refresh()
    }).catch((err) => {
      toast.error('oooops, something went wrong')
      console.log(err)
    })
  }, [])
  
  const handleDelete = useCallback(async(id: string, images : any[]) => {
    toast("deleting images ...please waite!")
    const handleImageDelete = async () =>{
      try {
        for (const item of images) {
          if (item.image) {
            const imageRef = ref(storage, item.image)
            await deleteObject(imageRef)
            console.log("image deleted", item.image)
            
          }
        }
      } catch (error) {
        return console.log("error during deleting images ")
        
      }
    }
    await handleImageDelete()

    axios.delete(`/api/product/${id}`).then((res) => {
      toast.success('product deleted')
      router.refresh()
    }).catch((err)=>{
      toast.error("failed to delete product")
      console.log(err)
    })
  }, [])
  
  return (
    //   CREATE A DATA TABLE from material ui data table
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="mt-8 mb-4 ">
        <Heading title = "Manage Products" center />
      </div>
    <div style={{height : 600,width:'100%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 9 },
          },
        }}
        pageSizeOptions={[9, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
      </div>
      </div>
  );
};

export default ManageProductsClient;
