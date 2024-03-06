import getCurrentUser from '@/actions/getCurrentUser'
import Container from '@/app/components/Container'
import FormWrap from '@/app/components/FormWrap'
import NullData from '@/app/components/products/NullData'
import AddProductForm from './AddProductForm'


const AddProducts = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <NullData  title='Ooops access denied'/>
  }
  return (
    <div className=' p-8'>
      <Container>
        <FormWrap>
         <AddProductForm/>
        </FormWrap>
    </Container>
    </div>
  )
}

export default AddProducts