"use client"
import Link from "next/link"
import Container from "../Container"
import AdminNavItem from "./AdminNavItem"
import { MdDashboard, MdDns, MdFormatListBulletedAdd, MdLibraryAdd } from "react-icons/md"
import { usePathname } from "next/navigation"


const AdminNav = () => {
  // use the hook to check the pathname in selected 
  const pathname  = usePathname()
  return (
      <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
          <Container>
              <div className="flex flex-row items-center 
              justify-between md:justify-center gap-8 md:gap-12
              overflow-x-auto flex-nowrap">
          <Link href='/admin'>
            {/* inside the link to be clickable */}
            <AdminNavItem
              label="summary"
              icon={MdDashboard}
              selected={pathname === '/admin'} />
          </Link> 
          <Link href='/admin/add-products'>
            {/* inside the link to be clickable */}
            <AdminNavItem
              label="AddProducts"
              icon={MdLibraryAdd}
              selected={pathname === '/add-products'} />
          </Link> 
        <Link href='/admin/manage-products'>
            {/* inside the link to be clickable */}
            <AdminNavItem
              label="ManageProducts"
              icon={MdDns}
              selected={pathname === '/admin/manage-products'} />
          </Link>   
        <Link href='/admin/manage-orders'>
            {/* inside the link to be clickable */}
            <AdminNavItem
              label="ManageOrders"
              icon={MdFormatListBulletedAdd}
              selected={pathname === '/admin/manage-orders'} />
          </Link>   
              </div>
         </Container>
    </div>
  )
}

export default AdminNav