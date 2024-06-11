// Import necessary modules and components
import getCurrentUser from "@/actions/getCurrentUser";
import Container from "../components/Container";
import CartClient from "./CartClient";

// Cart component to display the user's shopping cart
const Cart = async () => {
  // Fetch the current user's data
  const currentUser = await getCurrentUser();

  return (
    <div className="pt-8">
      {/* Container component to wrap the cart content */}
      <Container>
        {/* CartClient component to display the user's cart */}
        <CartClient currentUser={currentUser} />
      </Container>
    </div>
  );
};

// Export the Cart component
export default Cart;
