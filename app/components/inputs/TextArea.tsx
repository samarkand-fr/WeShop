"use client"
// Import necessary types and hooks from React for the component.
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

// Interface defining the props for the TextArea component.
interface TextAreaProps {
  id: string;                              // Unique identifier for the textarea.
  label: string;                           // Label text for the textarea.
  disabled?: boolean;                      // Optional flag for disabling the textarea.
  required?: boolean;                      // Optional flag for marking the textarea as required.
  register: UseFormRegister<FieldValues>;  // useForm register function for form registration.
  errors: FieldErrors;                     // Errors object from useForm for handling form errors.
}

// TextArea component represents a textarea input with specific styling and behavior.
const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
}) => {
  return (
    <div className="w-full relative">
      {/* Textarea input element */}
      <textarea
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
        className={`
          peer
          w-full
          p-4
          pt-6
          max-h-[150px]
          min-h-[150px]
          outline-none
          bg-white
          font-light
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled: cursor-not-allowed
          ${errors[id] ? "border-rose-400" : "border-slate-300"}
          ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
        `}
      />

      {/* Label for the textarea */}
      <label
        htmlFor={id}
        // Changing styles based on focus and error state.
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

export default TextArea;
