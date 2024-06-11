"use client"
// Import necessary types and hooks from React for the component.
import { ImageType } from "@/types";
import { useCallback } from "react";
import { useDropzone } from 'react-dropzone';

// Interface defining the props for the SelectImage component.
interface SelectImageProps {
    item?: ImageType;                     // Optional ImageType for the color item.
    handleFileChange: (value: File) => void; // Function to handle file change.
}

// SelectImage component allows users to select and drop image files.
const SelectImage: React.FC<SelectImageProps> = ({ item, handleFileChange }) => {
    
    // MyDropzone component encapsulates the file drop zone logic.
    function MyDropzone() {
        // Callback to handle file drop.
        const onDrop = useCallback((acceptedFiles: File[]) => {
            // Do something with the files
            if (acceptedFiles.length > 0) {
                handleFileChange(acceptedFiles[0]);
            }
        }, []);

        // useDropzone hook for handling drag-and-drop functionality.
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop,
            accept: {
                'image/*': ['.jpeg', '.png']
            }
        });

        // Return JSX representing the drop zone.
        return (
            <div {...getRootProps()} className="border-2 border-slate-400 p-2 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex items-center justify-center">
                <input {...getInputProps()} />
                {/* Display different message based on whether a file is being dragged or not. */}
                {isDragActive ? (<p>Drop image here ...</p>) : (<p> + {item?.color} Image</p>)}
            </div>
        );
    }

    // Return JSX representing the SelectImage component.
    return (
        <div>
            {/* Render the MyDropzone component within the SelectImage component. */}
            <MyDropzone />
        </div>
    );
};

export default SelectImage;
