// Import necessary modules and components
import getProductById from "@/actions/getProductById";
import Container from "@/app/components/Container";
import ListRating from "@/app/components/ListRating";
import NullData from "@/app/components/products/NullData";
import ProductDetails from "@/app/product/[productId]/ProductDetails";
import { products } from "@/utils/products";
import AddRating from "./AddRating";
import getCurrentUser from "@/actions/getCurrentUser";

// Define the interface for URL parameters
interface Idparams {
  productId?: string;
}

// Define the Product component
const Product = async ({ params }: { params: Idparams }) => {
  // Fetch the current user
  const user = await getCurrentUser();

  // Fetch the product by ID
  const product = await getProductById(params);

  // If the product does not exist, display an error message
  if (!product)
    return <NullData title="Product with the given ID does not exist" />;

  // Render the Product component
  return (
    <div className="p-8">
      {/* Container for product details and ratings */}
      <Container>
        {/* Display product details */}
        <ProductDetails product={product} />

        {/* Container for adding and listing ratings */}
        <div className="flex flex-col mt-20 gap-4">
          {/* Add rating component */}
          <AddRating product={product} user={user} />

          {/* List of ratings component */}
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

// Export the Product component
export default Product;
