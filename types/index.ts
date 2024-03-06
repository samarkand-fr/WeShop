import { User } from "@prisma/client"

export type CartProductType ={
    id:string,
    name:string,
    description:string,
    category:string,
    brand:string,
    selectedImg:SelectedImgType,
    quantity:number,
    price:number

}
export type SelectedImgType ={
  color:string,
  colorCode:string,
  image:string
}
export interface SetColorProps {
    images :SelectedImgType[],
    cartProduct: CartProductType,
    handleColorSelect:(value:SelectedImgType) => void
}

export type ImageType = {
  color: string;
  colorCode: string;
  image : File | null
  
}
// from our firebase storage 
export type UploadedImageType = {
  color: string;
  colorCode: string;
  image : string
  
}
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

  
