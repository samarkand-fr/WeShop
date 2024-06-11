"use client"
// Importing necessary types from react-hook-form for form registration.
import { FieldValues, UseFormRegister } from "react-hook-form"

// Interface defining the props for the CustomCheckbox component.
interface CustomCheckboxProps {
    id: string;                           // Unique identifier for the checkbox.
    label: string;                        // Label text for the checkbox.
    disabled?: boolean;                   // Indicates whether the checkbox is disabled.
    register: UseFormRegister<FieldValues>; // Form registration function from react-hook-form.
}

// CustomCheckbox component represents a styled checkbox with label.
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    id,
    label,
    disabled,
    register
}) => {
  return (
      // Container for the checkbox and label with dynamic styling based on props.
      <div className="w-full flex flex-row gap-2 items-center">
          {/* Actual checkbox input with unique identifier, disabled state, and registration. */}
          <input
            type="checkbox"
            id={id}
            disabled={disabled}
            {...register(id)}
            placeholder=""
            className="cursor-pointer"
          />
          {/* Label for the checkbox with font styling and cursor pointer. */}
          <label htmlFor={id} className="font-medium cursor-pointer">{label}</label>
      </div>
  )
}

export default CustomCheckbox;
