import moment from "moment";
import prisma from "@/libs/prismadb"

export default async function getGraphData() {
    try {
        // get the start& end  data day from range
        const startDate = moment().subtract(6, "days").startOf("day")
        const endDate = moment().endOf("day")
        
        // query from db to get order data grouped by createdDate
        const result = await prisma.order.groupBy({
            by: ["createdDate"],
            where: {
                createdDate: {
                    gte: startDate.toISOString(),
                    lte: endDate.toISOString(),
                },
                status: "complete",
            },
            _sum: {
                amount: true
            }
        })
        // initialize an object to agregate the data by date
        const aggregatedData: {
            [day: string]: {
                day: string;
                date: string;

                totalAmount: number
            }
        } = {};
        // create a clone of start date to iterate the data by date 
        const currentDate = startDate.clone()
        // loop through each day in date range
        while (currentDate <= endDate) {
            // format day as string eg ('sunday')
            const day = currentDate.format('dddd')
        
            // initialize the eggretatd data for day,with day,date total amount
            aggregatedData[day] = {
                day,
                date: currentDate.format("YYYY-MM-DD"),
                totalAmount: 0
            }
            // move to next day
            currentDate.add(1, "day")
        }
        //   calculate the total amount by summing order amount  
        result.forEach((entry) => {
            const day = moment(entry.createdDate).format("dddd");
            const amount = entry._sum?.amount || 0;
            aggregatedData[day].totalAmount += amount
        })

        // convert the aggregatedData to array to sort it
        const formattedData = Object.values(aggregatedData).sort((a, b) =>
            moment(a.date).diff(moment(b.date))
        )
        return formattedData
    } catch (error: any) {
        throw new Error(error)
    }
}