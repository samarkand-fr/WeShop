// Interface defining the props for the NullData component.
interface NullDataProps {
  title: string; // The message or title to be displayed.
}

// NullData component represents a display when there is no data.
const NullData: React.FC<NullDataProps> = ({ title }) => {
  return (
    // Container for the NullData message with flex layout and centering.
    <div className="w-full h-[50vh] flex items-center justify-center text-xl md:text-2xl">
      {/* Displaying the title or message. */}
      <p className="font-medium">{title}</p>
    </div>
  );
};

export default NullData;
