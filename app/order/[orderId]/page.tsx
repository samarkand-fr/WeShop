import getOrderById from "@/actions/getOrderById";
import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import NullData from "@/app/components/products/NullData";

// this file was used just to figure one order fo dev purposes to be easy to managed
// import { order } from "@/app/utils/order";
// here the whole orders file 2nd step

interface IParams {
  orderId?: string;
}
// params=access to order id in url
const Order = async ({ params }: { params: IParams }) => {
  const order = await getOrderById(params);

  if (!order) return <NullData title="No Order"></NullData>;
  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
