import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongoose";
import { Schema, model, models, Model } from "mongoose";
import formidable, { IncomingForm } from "formidable";
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

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await connectDB();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Valid image ID is required" });
  }

  // Handle DELETE request
  if (req.method === "DELETE") {
    try {
      const deletedImage = await TicketImage.findOneAndDelete({ id });

      if (!deletedImage) {
        console.log("Image not found for ID:", id);
        return res.status(404).json({ message: "Image not found" });
      }

      // Clear cache if image is deleted
      delete imageCache[id];

      console.log("Image deleted:", deletedImage.id);
      return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      return res.status(500).json({ message: "Error deleting image", error });
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

      // Query the database
      const imageDoc = await TicketImage.findOne({ id });

      if (!imageDoc) {
        console.log("Image not found for ID:", id);
        return res.status(404).json({ message: "Image not found" });
      }

      // Cache the image and return it
      imageCache[id] = imageDoc.image;

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=3600, immutable");
      return res.send(imageDoc.image);
    } catch (error) {
      console.error("Error retrieving image:", error);
      return res.status(500).json({ message: "Error retrieving image", error });
    }
  }

  // Handle PUT request to update images
  if (req.method === "PUT") {
    try {
      const form = new IncomingForm();
      
      const parseForm = () =>
        new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
          });
        });
  
      // Parse the form
      const { fields, files } = await parseForm();
  
      // Log the parsed files and file path
      console.log("Parsed files:", files);
      console.log("Image file path:", files.image?.filepath); // Log the filepath
  
      const imageFile = files.image;
  
      if (!imageFile || !imageFile.filepath || typeof imageFile.filepath !== "string") {
        return res.status(400).json({ message: "Valid image file is required" });
      }
  
      // Read the image file into a buffer
      const imageBuffer = await fs.readFile(imageFile.filepath);
  
      // Update the image in the database
      const updatedImage = await TicketImage.findOneAndUpdate(
        { id: fields.id },
        { image: imageBuffer },
      );
  
      if (!updatedImage) {
        return res.status(404).json({ message: "Image not found" });
      }
  
      imageCache[fields.id] = updatedImage.image;
  
      console.log("Image updated successfully:", updatedImage.id);
      return res.status(200).json({ message: "Image updated successfully", imageId: updatedImage.id });
    } catch (error) {
      console.error("Error processing PUT request:", error);
      return res.status(500).json({ message: "Error processing request", error });
    }
  }
  
  
  

  // Handle unsupported methods
  res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
