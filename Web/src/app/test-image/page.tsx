"use client";
import React, { useState } from 'react';
import uploadImageForTicket from '@/models/UpdateImage'; // Adjust the import path as needed

const UpdateImageComponent = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageId, setImageId] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // State for image preview URL

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile && selectedFile.type.startsWith('image/')) {
                setImage(selectedFile); // Save the image file
                setPreviewUrl(URL.createObjectURL(selectedFile)); // Generate a preview URL
            } else {
                alert('Please select a valid image file.');
                setImage(null);
                setPreviewUrl(null); // Clear the preview if an invalid file is selected
            }
        }
    };

    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageId(event.target.value); // Save the image ID
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!image || !imageId) {
            alert('Please provide an image and an ID');
            return;
        }

        // Use the uploadImageForTicket function to handle the upload
        const result = await uploadImageForTicket({ Image: imageId }, image);

        if (result) {
            alert(result.message);
        } else {
            alert("Failed to update the image.");
        }

        // Revoke the preview URL after form submission to free up memory
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={imageId}
                onChange={handleIdChange}
                placeholder="Enter image ID"
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
            />

            {/* Show the image preview if a file is selected */}
            {previewUrl && (
                <div>
                    <p>Image Preview:</p>
                    <img src={previewUrl} alt="Image preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                </div>
            )}

            <button type="submit">Update Image</button>
        </form>
    );
};

export default UpdateImageComponent;
