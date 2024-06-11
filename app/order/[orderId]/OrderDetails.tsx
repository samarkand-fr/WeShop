// Import necessary modules and components.
import { Order } from "@prisma/client";
import Heading from "../../components/Heading";
import { formatPrice, formatPriceToDollars } from "@/utils/formatPrice";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md";
import Status from "../../components/Status";
import moment from "moment";
import OrderItem from "./OrderItem";

// Define the OrderDetails component.
interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="max-w-[1150px] m-auto flex  flex-col gap-2">
      {/* Heading for order details */}
      <div className="mt-8">
        <Heading title="Order Details" />
      </div>
      {/* Order ID and total amount */}
      <div>Order ID : {order.id}</div>
      <div>
        Total Amount :{" "}
        <span className="font-bold">{formatPriceToDollars(order.amount)}</span>
      </div>
      {/* Payment status */}
      <div className="flex gap-2 items-center">
        <div>Payment Status : </div>
        <div>
          {/* Status component based on payment status */}
          {order.status === "pending" ? (
            <Status
              text="pending"
              icon={MdAccessTimeFilled}
              color="text-slate-700"
              bg="bg-slate-200"
            />
          ) : order.status === "complete" ? (
            <Status
              text="completed"
              icon={MdDone}
              color="text-green-700"
              bg="bg-green-200"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Delivery status */}
      <div className="flex gap-2 items-center">
        <div>Delivery Status : </div>
        <div>
          {/* Status component based on delivery status */}
          {order.deliveryStatus === "pending" ? (
            <Status
              text="pending"
              icon={MdAccessTimeFilled}
              color="text-slate-700"
              bg="bg-slate-200"
            />
          ) : order.deliveryStatus === "dispatched" ? (
            <Status
              text="dispatched"
              icon={MdDeliveryDining}
              color="text-purple-700"
              bg="bg-purple-200"
            />
          ) : order.deliveryStatus === "delivered" ? (
            <Status
              text="delivered"
              icon={MdDone}
              color="text-green-700"
              bg="bg-green-200"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Date of the order */}
      <div>Date : {moment(order.createdDate).fromNow()}</div>
      {/* Products ordered */}
      <div>
        <h2 className="font-semibold mt-4 mb-2">Products Ordered</h2>
        {/* Table header for products */}
        <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center">
          <div className="col-span-2 justify-self-start">Product</div>
          <div className="justify-self-center">Price</div>
          <div className=" justify-self-center">Quantity</div>
          <div className=" justify-self-last">Total Amount</div>
        </div>
        {/* Render each product in a separate OrderItem component */}
        {order.products &&
          order.products.map((item) => {
            return <OrderItem key={item.id} item={item} />;
          })}
      </div>
    </div>
  );
};

// Export the OrderDetails component.
export default OrderDetails;
