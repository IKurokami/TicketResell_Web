type UpdateImageResult = {
  success: boolean;
  error: string | null;
};

export async function updateImage(
  imageId: string,
  imageFile: File
): Promise<UpdateImageResult> {
  // Ensure both image ID and file are provided
  if (!imageId || !imageFile) {
    console.error("Error: Both imageId and imageFile are required.");
    return {
      success: false,
      error: "Please provide both an ID and an image file.",
    };
  }

  const formData = new FormData();
  formData.append("image", imageFile); // 'image' should match your backend expectation

  console.log("Preparing to update image:", {
    imageId,
    imageFileName: imageFile.name,
  });

  try {
    // Make the PUT request to the API
    const response = await fetch(`/api/images/${imageId}`, {
      method: "PUT",
      body: formData, // FormData automatically sets the correct Content-Type
    });

    // Debug logging for server response
    console.log("Received response from server:", {
      status: response.status,
      statusText: response.statusText,
    });

    // If the server response is not OK, handle the error
    if (!response.ok) {
      // Attempt to parse the server's JSON response for detailed error information
      const errorResponse = await response.json().catch(() => null); // Graceful error parsing
      const errorMessage = errorResponse?.message || response.statusText;

      console.error("Server error details:", errorResponse || response.statusText);

      return {
        success: false,
        error: `Server error: ${errorMessage}`,
      };
    }

    // Image update success
    console.log("Image updated successfully:", imageId);
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    // Catch network errors or unexpected issues
    console.error("Error updating image:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating the image. Please try again.",
    };
  }
}
