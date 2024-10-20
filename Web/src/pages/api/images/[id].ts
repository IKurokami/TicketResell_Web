import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongoose";
import { Schema, model, models, Model } from "mongoose";
import formidable from "formidable";
import { promises as fs } from "fs"; // Promises-based fs for async/await

// Define the interface for the image document
interface ITicketImage {
  _id: Schema.Types.ObjectId;
  id: string;
  image: Buffer;
}

// Define the schema matching your actual DB structure
const TicketImageSchema = new Schema<ITicketImage>({
  id: { type: String, required: true, unique: true },
  image: { type: Buffer, required: true },
});

// Get or create the model
const TicketImage: Model<ITicketImage> =
  models.TicketImage || model<ITicketImage>("TicketImage", TicketImageSchema);

// Simple in-memory cache to store images
const imageCache: Record<string, Buffer> = {};

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser for file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to the database
  await connectDB();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Valid image ID is required" });
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    try {
      const deletedImage = await TicketImage.findOneAndDelete({ id: id });

      if (!deletedImage) {
        console.log("Image not found for ID:", id);
        return res.status(404).json({ message: "Image not found" });
      }

      console.log("Image deleted:", deletedImage.id);
      return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      return res.status(500).json({ message: "Error deleting image" });
    }
  }

  // Handle GET request
  if (req.method === "GET") {
    try {
      console.log("Searching for image with ID:", id);

      // Check the cache first
      if (imageCache[id]) {
        console.log("Image retrieved from cache for ID:", id);
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=3600, immutable"); // Cache for 1 hour
        return res.send(imageCache[id]);
      }

      // Explicitly query by the 'id' field, not _id
      const imageDoc = await TicketImage.findOne({ id: id });

      if (!imageDoc) {
        console.log("Image not found for ID:", id);
        return res.status(404).json({ message: "Image not found" });
      }

      console.log("Image found:", imageDoc.id);

      // Store the image in the cache
      imageCache[id] = imageDoc.image;

      // Set the appropriate content type and caching headers
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=3600, immutable"); // Cache for 1 hour

      // Send the image data
      return res.send(imageDoc.image);
    } catch (error) {
      console.error("Error retrieving image:", error);
      return res.status(500).json({ message: "Error retrieving image" });
    }
  }

  // Handle PUT request to update images
  if (req.method === "PUT") {
    try {
      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parsing error:", err);
          return res.status(500).json({ message: "Error parsing form data" });
        }

        const imageFile = files.image; // Ensure the file field matches 'image'

        if (!imageFile) {
          return res.status(400).json({ message: "Image file is required" });
        }

        try {
          // Read the image file as a buffer
          const imageBuffer = await fs.readFile(imageFile.filepath);

          // Update the image in the database based on the 'id'
          const updatedImage = await TicketImage.findOneAndUpdate(
            { id: id }, // Match the custom 'id' field
            { image: imageBuffer },
            { new: true } // Return the updated document
          );

          if (!updatedImage) {
            return res.status(404).json({ message: "Image not found" });
          }

          console.log("Image updated successfully:", updatedImage.id);

          return res
            .status(200)
            .json({ message: "Image updated successfully", imageId: updatedImage.id });
        } catch (fileError) {
          console.error("Error processing image file:", fileError);
          return res.status(500).json({ message: "Error processing image file" });
        }
      });
    } catch (error) {
      console.error("Error updating image:", error);
      return res.status(500).json({ message: "Error updating image" });
    }
  }

  // Handle unsupported HTTP methods
  res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
