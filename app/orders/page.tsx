import Container from "@/app/components/Container"
import OrdersClient from "./OrderClient"
import getCurrentUser from "@/actions/getCurrentUser"
import NullData from "@/app/components/products/NullData"
import getOrdersByUserId from "@/actions/getOrdersByUserId"

const Orders = async () => {
  const currentUser = await getCurrentUser()
  
  if (!currentUser ) {
    return <NullData  title='Ooops access denied'/>
  }
  
    const orders = await getOrdersByUserId(currentUser.id)
    if (!orders ) {
        return <NullData  title='No Available Orders Yet'/>
      }
  return (
    <div className="p-8">
      <Container>
      <OrdersClient orders = {orders} />
      </Container>
    </div>
  )
}

export default Orders