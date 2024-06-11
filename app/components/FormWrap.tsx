// FormWrap component wraps form-related content in a styled container.
const FormWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    // Container with styling for form-related content.
    <div className="min-h-fit h-full flex items-center justify-center pb-12 pt-24">
      <div className="max-w-[650px] w-full flex flex-col gap-6 items-center shadow-xl shadow-slate-200 rounded-md p-4 md:p-8">
        {/* Rendering child components (form-related content) */}
        {children}
      </div>
    </div>
  );
};

export default FormWrap;
