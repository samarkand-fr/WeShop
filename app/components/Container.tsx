// Interface defining the props for the Container component.
interface ContainerProps {
  children: React.ReactNode; // Child components to be wrapped by the container.
}

// Container component wraps all app components in a container for layout consistency.
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
      // Container with responsive max-width and horizontal padding.
      <div className="max-w-[1920px] 
                      mx-auto
                      xl-px-20
                      md-px-2
                      px-4">
          {/* Rendering child components */}
          {children}
      </div>
  );
}

export default Container;
