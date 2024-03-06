import AdminNav from "../components/admin/AdminNav"

export const metaData = {
    title: 'WeShop Admin',
    description : 'WeShop Admin Dashboard'
}
// nested layout in dashboard layout change selon children
const Adminlayout = ({children}:{children:React.ReactNode}) => {
  return (
      <div>
          <AdminNav />
          {/* this will invoke page admin  and its children  */}
          {children}
   </div>
  )
}

export default Adminlayout