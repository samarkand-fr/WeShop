// Import necessary types and libraries.
import { IconType } from "react-icons";

// Define the properties expected by the AdminNavItem component.
interface AdminNavItemProps {
  selected: boolean; // Whether the item is selected or not.
  icon: IconType; // Icon component to display.
  label: string; // Label for the navigation item.
}

// AdminNavItem component represents a single item in the admin navigation bar.
const AdminNavItem: React.FC<AdminNavItemProps> = ({
  selected,
  icon: Icon,
  label,
}) => {
  return (
    <div
      className={`flex items-center justify-center text-center gap-1
                  p-2 border-b-2 hover:text-slate-800 transition cursor-pointer
                  ${selected ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-500'}`}>
      {/* Display the provided icon */}
      <Icon size={20} />
      {/* Display the label for the navigation item */}
      <div className="font-medium text-sm text-center break-normal">{label}</div>
    </div>
  );
};

export default AdminNavItem;
