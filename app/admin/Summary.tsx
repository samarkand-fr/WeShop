// "use client";

// import { Order, Product, User } from "@prisma/client";
// import { useEffect, useState } from "react";
// import Heading from "../components/Heading";
// import { formatPrice } from "@/utils/formatPrice";
// import { formatNumber } from "@/utils/formatNumber";

// interface SummaryProps {
//   orders: Order[];
//   products: Product[];
//   users: User[];
// }
// type summaryDataType = {
//   [key: string]: {
//     label: string;
//     digit: number;
//   };
// };
// const Summary: React.FC<SummaryProps> = ({ orders, products, users }) => {
//   const [summaryData, setSummaryData] = useState<summaryDataType>({
//     sale: {
//       label: "Total Sale",
//       digit: 0,
//     },
//     poducts: {
//       label: "Total Products",
//       digit: 0,
//     },
//     orders: {
//       label: "Total Orders",
//       digit: 0,
//     },
//     paidOrders: {
//       label: "Paid Orders",
//       digit: 0,
//     },
//     unPaidOrders: {
//       label: "Unpaid Orders",
//       digit: 0,
//     },
//     users: {
//       label: "Total Users",
//       digit: 0,
//     },
//   });

//     useEffect(() => {
//         console.log("Orders:", orders);
//         console.log("Products:", products);
//         console.log("Users:", users);
//     setSummaryData((prev) => {
//         let temporaryData = { ...prev };
        
//       const totalSale = orders.reduce((acc, item) => {
//         if (item.status === "complete") {
//           return acc + item.amount;
//         } else return acc;
//       }, 0);
        
//       const paidOrders = orders.filter((order) => {
//         return order.status === "complete";
//       });
        
//       const unpaidOrders = orders.filter((order) => {
//         return order.status === "pending";
//       });

//       temporaryData.sale.digit = totalSale;
//       temporaryData.orders.digit = orders.length;
//       temporaryData.paidOrders.digit = paidOrders.length;
//       temporaryData.unPaidOrders.digit = unpaidOrders.length;
//       //   temporaryData.products.digit = products.length;
//       temporaryData.users.digit = users.length;
//       if (temporaryData && temporaryData.products) {
//         temporaryData.products.digit = products.length;
//       } else {
//         console.error("temporaryData or temporaryData.products is undefined");
//       }

//       return temporaryData;
//     });
//   }, [orders, products, users]);
//   // convert the object to array in order to loop through
//   const summaryKeys = Object.keys(summaryData);

//   return (
//     <div className="maw-w-[1150px] m-auto">
//       <div className="mb-4 mt-8">
//         <Heading title="Stats" center />
//       </div>
//       <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
//         {/* mapping through data which has form of an object ,convert & use summarykeys*/}
//         {summaryKeys &&
//           summaryKeys.map((key) => {
//             return (
//               <div
//                 key={key}
//                 className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition"
//               >
//                 <div className="text-xl md:text-4xl font-bold">
//                   {summaryData[key].label === "Total Sale" ? (
//                     <>{formatPrice(summaryData[key].digit)}</>
//                   ) : (
//                     <>{formatNumber(summaryData[key].digit)}</>
//                   )}
//                 </div>
//                 <div>{summaryData[key].label}</div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// export default Summary;
"use client"
import { Order, Product, User } from "@prisma/client";
import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import { formatPrice } from "@/utils/formatPrice";
import { formatNumber } from "@/utils/formatNumber";

interface SummaryProps {
  orders: Order[];
  products: Product[];
  users: User[];
}

type SummaryDataType = {
  label: string;
  digit: number;
};

const Summary: React.FC<SummaryProps> = ({ orders, products, users }) => {
  const [summaryData, setSummaryData] = useState<{
    [key: string]: SummaryDataType;
  }>({
    sale: { label: "Total Sale", digit: 0 },
    products: { label: "Total Products", digit: 0 },
    orders: { label: "Total Orders", digit: 0 },
    paidOrders: { label: "Paid Orders", digit: 0 },
    unPaidOrders: { label: "Unpaid Orders", digit: 0 },
    users: { label: "Total Users", digit: 0 },
  });

  useEffect(() => {
    setSummaryData((prev) => {
      const temporaryData = { ...prev };

      const totalSale = orders.reduce((acc, item) => {
        if  (item.status === "complete" || item.status === "pending")  {
          return acc + item.amount;
        } else {
          return acc;
        }
      }, 0);

      const paidOrders = orders.filter((order) => order.status === "complete");
      const unpaidOrders = orders.filter((order) => order.status === "pending");

      temporaryData.sale.digit = totalSale;
      temporaryData.orders.digit = orders.length;
      temporaryData.paidOrders.digit = paidOrders.length;
      temporaryData.unPaidOrders.digit = unpaidOrders.length;
      temporaryData.products.digit = products.length;
      temporaryData.users.digit = users.length;

      return temporaryData;
    });
  }, [orders, products, users]);

  // convert the object to an array to loop through
  const summaryKeys = Object.keys(summaryData);

  return (
    <div className="maw-w-[1150px] m-auto">
      <div className="mb-4 mt-8">
        <Heading title="Stats" center />
      </div>
      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {/* mapping through data which has the form of an object, convert & use summarykeys */}
        {summaryKeys.map((key) => (
          <div
            key={key}
            className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition"
          >
            <div className="text-xl md:text-4xl font-bold">
              {key === "sale" ? (
                <>{formatPrice(summaryData[key].digit)}</>
              ) : (
                <>{formatNumber(summaryData[key].digit)}</>
              )}
            </div>
            <div>{summaryData[key].label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
