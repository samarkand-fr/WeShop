// Importing necessary dependencies and types.
import { IconType } from "react-icons";

// Interface defining the props for the ActionBtn component.
interface ActionBtnProps {
  icon: IconType; // The React icon component to be displayed.
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void; // Callback function for button click.
  disabled?: boolean; // Flag to indicate if the button is disabled.
}

// ActionBtn component represents a button with an icon for specific actions.
const ActionBtn: React.FC<ActionBtnProps> = ({ icon: Icon, onClick, disabled }) => {
  return (
    // Button container with styling based on properties.
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded cursor-pointer w-[40px] h-[30px]
       text-slate-700 border border-slate-400
       ${disabled && "opacity-50 cursor-not-allowed"}`}
    >
      {/* Displaying the icon inside the button */}
      <Icon size={18} />
    </button>
  );
};

export default ActionBtn;
