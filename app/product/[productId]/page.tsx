// import Container from "@/app/components/Container";
// import ListRating from "@/app/components/ListRating";
// import ProductDetails from "@/app/components/products/ProductDetails";
// // this file was used just to figure one product fo dev purposes to be easy to managed
// // import { product } from "@/app/utils/product";
// // here the whole products file 2nd step
// import { products } from "@/utils/products";

// interface Idparams {
//   productId?: string;
// }
// // params=access to product id in url
// const Product = ({ params }: { params: Idparams }) => {
//   // server component ,then console.log will be in the terminal
//   console.log("params", params);
//   // here the 2nd step to use the whole util productfile
//   const product = products.find((item) => item.id === params.productId);
//   return (
//     <div className="p-8">
//       <Container>
//         <ProductDetails product={product} />
//         <div className="flex flex-col mt-20 gap-4">
//           {/* <div>add rating</div> */}
//           <ListRating product={product} />
//           <div>list of rating</div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default Product;

// change the file to be able to search products from db with an id
import getProductById from "@/actions/getProductById";
import Container from "@/app/components/Container";
import ListRating from "@/app/components/ListRating";
import NullData from "@/app/components/products/NullData";
import ProductDetails from "@/app/product/[productId]/ProductDetails";
// this file was used just to figure one product fo dev purposes to be easy to managed
// import { product } from "@/app/utils/product";
// here the whole products file 2nd step
import { products } from "@/utils/products";
import AddRating from "./AddRating";
import getCurrentUser from "@/actions/getCurrentUser";

interface Idparams {
  productId?: string;
}
// params=access to product id in url
const Product = async ({ params }: { params: Idparams }) => {
  const user =  await getCurrentUser()
  const product = await getProductById(params);

  if (!product)
    return <NullData title="product with the given id doesnot exist" />;
  
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
         
          {/* <div>list of rating</div> */}
          <AddRating product={product} user={user} />
           {/* <div>add rating</div> */}
           <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
