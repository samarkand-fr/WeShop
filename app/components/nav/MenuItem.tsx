// Interface defining the props for the MenuItem component.
interface MenuItemProps {
  children: React.ReactNode; // The content to be rendered inside the menu item.
  onClick: () => void; // Callback function to be executed on menu item click.
}

// MenuItem component represents a single item in a menu.
const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  return (
    // Container for the menu item with click event and styling.
    <div onClick={onClick} className="px-4 py-3 bg-neutral-100 transition">
      {/* Rendering the content passed as children inside the menu item. */}
      {children}
    </div>
  );
};

export default MenuItem;
