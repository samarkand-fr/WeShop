// Importing IconType from react-icons for dynamic icons.
import { IconType } from "react-icons";

// Interface defining the props for the Status component.
interface StatusProps {
  text: string;   // Text to display in the status.
  icon: IconType;  // Icon component to display.
  bg: string;     // Background color for the status.
  color: string;  // Text color for the status.
}

// Status component displays a status with text, icon, background, and text color.
const Status: React.FC<StatusProps> = ({ text, icon: Icon, bg, color }) => {
  return (
    // Container for the status with dynamic styling based on props.
    <div
      className={`
      ${bg}
      ${color}
      px-1
      rounded
      flex items-center
      gap-1
      `}
    >
      {/* Displaying the text and icon within the status container. */}
      {text}
      <Icon size={15} />
    </div>
  );
};

export default Status;
