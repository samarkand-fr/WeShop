// Importing necessary dependencies.
"use client";
import { IconType } from "react-icons";

// Interface defining the props for the Button component.
interface ButtonProps {
    label: string; // Button label text.
    disabled?: boolean; // Flag to indicate if the button is disabled.
    outline?: boolean; // Flag to indicate if the button has an outline style.
    small?: boolean; // Flag to indicate if the button is small.
    custom?: string; // Custom styling class for the button.
    icon?: IconType; // The React icon component to be displayed.
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Callback function for button click.
}

// Button component represents a customizable button with optional icon.
const Button: React.FC<ButtonProps> = ({
    label,
    disabled,
    outline,
    small,
    custom,
    icon: Icon,
    onClick
}) => {
    return (
        // Button container with styling based on properties.
        <button
            onClick={onClick}
            disabled={disabled}
            className={`disabled:opacity-70
                       disabled:cursor-not-allowed
                       rounded-md
                       hover-opacity-80
                       transition
                       w-full
                       border-slate-700
                       flex
                       item-center
                       justify-center
                       gap-2
                       ${outline ? 'bg-white' : 'bg-slate-700'}
                       ${outline ? 'text-slate-700' : 'text-white'}
                       ${small ? 'text-sm font-light' : 'text-md font-semibold'}
                       ${small ? 'px-2 py-1 border-[1px]' : 'py-3 px-4 border-2'}
                       ${custom ? 'custom' : ''}
                       `}>
            {/* Displaying the icon inside the button if provided */}
            {Icon && <Icon size={24} />}
            {/* Displaying the label text */}
            {label}
        </button>
    );
}

export default Button;
