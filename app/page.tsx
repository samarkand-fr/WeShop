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
// This line sets the static regeneration time to 0 seconds, meaning that the page will be regenerated on every request.
export const revalidate = 0;

// Importing necessary components and functions.
import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import NullData from "./components/products/NullData";
import ProductCard from "./components/products/ProductCard";
// Importing the getProducts function and the IProductsParams interface.
import getProducts, { IProductsParams } from "@/actions/getProducts";

// Defining the interface for the Home component props.
interface HomeProps {
  searchParams: IProductsParams;
}

// Async function representing the Home component, which fetches products based on search parameters.
export default async function Home({ searchParams }: HomeProps) {
  // Fetching products using the getProducts function with the provided search parameters.
  const products = await getProducts(searchParams);

  // Checking if no products are found and rendering NullData component with a message.
  if (products.length === 0) return <NullData title="oops no product found, click 'All' to clear filters" />;
  
  // Implementing the Fisher-Yates shuffle algorithm to randomize the order of products.
  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Shuffling the products array.
  const shuffledProducts = shuffleArray(products);

  // Returning JSX to render the Home component with shuffled product cards.
  return (
    <div className="p-8">
      <Container>
        <div>
          {/* Rendering the HomeBanner component. */}
          <HomeBanner />
        </div>
        {/* Mapping through products array to show product cards under the banner using shuffled data. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  2xl:grid-cols-6 gap-8">
          {shuffledProducts.map((product: any) => {
            // Rendering a ProductCard component for each product in the shuffled array.
            return <ProductCard key={product} data={product} />;
          })}
        </div>
      </Container>
    </div>
  );
}
