import AdminNav from "../components/admin/AdminNav";

// Define the metadata correctly
export const metadata = {
  title: 'WeShop Admin',
  description: 'WeShop Admin Dashboard'
};

// Define the Admin layout component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {/* Render the children */}
      {children}
    </div>
  );
};

export default AdminLayout;
