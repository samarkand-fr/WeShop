// Import the CartContextProvider from the custom hook useCart.
import { CartContextProvider } from "@/hooks/useCart"

// Define the props for the CartProvider component.
interface CartProviderProps {
  children: React.ReactNode;
}

// CartProvider component: Wraps the application with the CartContextProvider.
const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  return (
    // Use the CartContextProvider to provide cart-related functionality to the application.
    <CartContextProvider>
      {/* Render the child components within the context of the CartContextProvider. */}
      {children}
    </CartContextProvider>
  );
}

// Export the CartProvider component for use in other parts of the application.
export default CartProvider;
