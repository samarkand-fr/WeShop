// Interface defining the props for the Heading component.
interface HeadingProps {
  title: string; // The title text to be displayed.
  center?: boolean; // Flag to indicate if the heading should be centered.
}

// Heading component represents a styled heading with optional centering.
const Heading: React.FC<HeadingProps> = ({ title, center }) => {
  return (
      // Container with text alignment based on the 'center' prop.
      <div className={center ? "text-center" : "text-start"}>
          {/* Rendering the heading with a bold font and 2xl size. */}
          <h1 className="font-bold text-2xl">{title}</h1>
      </div>
  );
}

export default Heading;
