// Interface defining the props for the BackDrop component.
interface BackDropProps {
  onClick: () => void; // Callback function to be executed on backdrop click.
}

// BackDrop component represents a semi-transparent backdrop with a click event.
const BackDrop: React.FC<BackDropProps> = ({ onClick }) => {
  return (
    // Container for the backdrop with fixed positioning covering the entire screen.
    <div
      onClick={onClick} // Click event to close or handle the backdrop.
      className="z-20 bg-slate-200 opacity-50 w-screen h-screen fixed top-0 left-0"
    ></div>
  );
};

export default BackDrop;
