// Import necessary modules and components
import Container from "@/app/components/Container";
import OrdersClient from "./OrderClient";
import getCurrentUser from "@/actions/getCurrentUser";
import NullData from "@/app/components/products/NullData";
import getOrdersByUserId from "@/actions/getOrdersByUserId";

// Define the Orders component
const Orders = async () => {
  // Get the current user using the getCurrentUser action
  const currentUser = await getCurrentUser();

  // If no current user, display access denied message
  if (!currentUser) {
    return <NullData title="Ooops access denied" />;
  }

  // Get orders associated with the current user
  const orders = await getOrdersByUserId(currentUser.id);

  // If no orders available, display no available orders message
  if (!orders) {
    return <NullData title="No Available Orders Yet" />;
  }

  // Render the OrdersClient component with the fetched orders
  return (
    <div className="p-8">
      <Container>
        <OrdersClient orders={orders} />
      </Container>
    </div>
  );
};

// Export the Orders component
export default Orders;
