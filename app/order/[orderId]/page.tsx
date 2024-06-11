// Import necessary modules and components
import getOrderById from "@/actions/getOrderById";
import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import NullData from "@/app/components/products/NullData";

// Define the interface for URL parameters
interface IParams {
  orderId?: string;
}

// Order component that fetches and displays order details
const Order = async ({ params }: { params: IParams }) => {
  // Fetch order details based on the orderId from URL parameters
  const order = await getOrderById(params);

  // If no order is found, render NullData component with a message
  if (!order) {
    return <NullData title="No Order" />;
  }

  // Render the Container component with OrderDetails inside
  return (
    <Container>
      <div className="p-8">
        <OrderDetails order={order} />
      </div>
    </Container>
  );
};

// Export the Order component
export default Order;
