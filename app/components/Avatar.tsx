// Importing necessary dependencies.
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

// Interface defining the props for the Avatar component.
interface AvatarProps {
    src?: string | null | undefined; // Source URL for the avatar image.
}

// Avatar component represents a user avatar with either an image or default icon.
const Avatar: React.FC<AvatarProps> = ({ src }) => {
    // Rendering the avatar image if the source is provided.
    if (src) {
        return (
            <Image
                src={src}
                alt="avatar"
                className="rounded-full"
                height="30"
                width="30"
            />
        );
    }
    // Rendering the default user icon if no source is provided.
    return (
        <FaUserCircle size={24} />
    );
}

export default Avatar;
