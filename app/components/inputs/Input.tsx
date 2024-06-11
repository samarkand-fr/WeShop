"use client"
// Importing necessary types from react-hook-form for form registration and error handling.
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

// Interface defining the props for the Input component.
interface InputProps {
  id: string;                            // Unique identifier for the input.
  label: string;                         // Label text for the input.
  type?: string;                         // Type of the input (e.g., text, password).
  disabled?: boolean;                    // Indicates whether the input is disabled.
  required?: boolean;                    // Indicates whether the input is required.
  register: UseFormRegister<FieldValues>; // Form registration function from react-hook-form.
  errors: FieldErrors;                    // Form errors for input validation.
}

// Input component represents a styled input field with dynamic styling based on props.
const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    // Container for the input field and label with dynamic styling based on props.
    <div className="w-full relative">
      {/* Actual input field with dynamic attributes and styling based on props and errors. */}
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
        type={type}
        className={`
          peer
          w-full
          p-4
          pt-6
          outline-none
          bg-white
          font-light
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${errors[id] ? "border-rose-400" : "border-slate-300"}
          ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
        `}
      />

      {/* Label for the input field with dynamic styling based on focus and errors. */}
      <label
        htmlFor={id}
        className={`
          absolute
          cursor-text
          text-md 
          duration-150 
          transform 
          -translate-y-3 
          top-5
          z-10 
          origin-[0] 
          left-4 
          peer-placeholder-shown:scale-100
          pee-placeholder-shown:translate-y-0 
          peer-focus:scale-75 
          peer-focaus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-slate-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
