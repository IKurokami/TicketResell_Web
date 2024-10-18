type UpdateImageResult = {
  success: boolean;
  error: string | null;
};

export async function updateImage(imageId: string, imageFile: File): Promise<UpdateImageResult> {
  if (!imageId || !imageFile) {
    return {
      success: false,
      error: "Please provide both an ID and an image file.",
    };
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`/api/images/${imageId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: "Image not found. Please check the ID and try again.",
        };
      }
      throw new Error(`Server error: ${response.statusText}`);
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error updating image. Please try again.",
    };
  }
}
