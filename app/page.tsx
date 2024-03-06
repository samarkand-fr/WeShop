// import Container from "./components/Container";
// import HomeBanner from "./components/HomeBanner";
// import ProductCard from "./components/products/ProductCard";
// // mocked data array
// import { products } from "../utils/products";

// export default function Home() {
//   return (
//     <div className="p-8">
//       <Container>
//         <div>
//           <HomeBanner />
//         </div>
//         {/* mapping through products array to show data under banner using mocked data */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  2xl:grid-cols-6 gap-8">
//           {products.map((product: any) => {
//             return <ProductCard key={product} data={product} />;
//           })}
//         </div>
//       </Container>
//     </div>
//   );
// }

// getting data from our db now 
export const revalidate = 0;

import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import NullData from "./components/products/NullData";
import ProductCard from "./components/products/ProductCard";
// mocked data array
import getProducts, { IProductsParams } from "@/actions/getProducts";

interface HomeProps {
  searchParams : IProductsParams
}

export default async function Home({ searchParams }: HomeProps) {
  
  const products = await getProducts(searchParams)
  // makes the products shown randomly on home page 
  if (products.length === 0) return <NullData title="oops no product found,click 'All'to clear filters" />
  
  // fisher-yates shuffle algo
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--){
      const j = Math.floor((Math.random)() * (i + 1));
     [array[i],array[j]]= [array[j], array[i]]
    }
    return array
  }
  const shuffledProducts = shuffleArray(products)
  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>
        {/* mapping through products array to show data under banner using mocked data */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  2xl:grid-cols-6 gap-8">
          {shuffledProducts.map((product: any) => {
            return <ProductCard key={product} data={product} />;
          })}
        </div>
      </Container>
    </div>
  );
}
