"use client";
import { useState } from "react";

const RetrievePage = () => {
  const [imageId, setImageId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setImageUrl("");

    if (!imageId) {
      setError("Please provide an ID");
      setIsLoading(false);
      return;
    }

    try {
      // Log the request URL for debugging
      console.log(`Fetching image from: /api/images/${imageId}`);

      const response = await fetch(`/api/images/${imageId}`);

      if (!response.ok) {
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);

        if (response.status === 404) {
          throw new Error(
            "Image not found. Please check the ID and try again."
          );
        }
        throw new Error(`Server error: ${response.statusText}`);
      }

      // Create a blob URL from the image data
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("Error retrieving image:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error retrieving image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Retrieve Image</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="id" style={{ display: "block", marginBottom: "5px" }}>
            Image ID:
          </label>
          <input
            type="text"
            id="id"
            value={imageId}
            onChange={handleIdChange}
            placeholder="Enter image ID (e.g., TICKET001)"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Retrieve Image"}
        </button>
      </form>

      {error && <div>{error}</div>}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            Retrieved Image:
          </h2>
          <img src={imageUrl} alt="Retrieved image" />
        </div>
      )}
    </div>
  );
};

export default RetrievePage;
