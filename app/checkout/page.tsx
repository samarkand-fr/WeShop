// Import necessary components
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import CheckoutClient from "./CheckoutClient";

// Checkout component responsible for rendering the checkout page
const Checkout = () => {
  return (
    // Container for styling and layout
    <div className="p-8">
      {/* Main container for the checkout page */}
      <Container>
        {/* FormWrap for styling the form */}
        <FormWrap>
          {/* CheckoutClient component for handling the checkout process */}
          <CheckoutClient />
        </FormWrap>
      </Container>
    </div>
  );
};

// Export the Checkout component
export default Checkout;
