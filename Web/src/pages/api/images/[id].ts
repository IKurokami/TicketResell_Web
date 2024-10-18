// pages/api/images/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongoose";
import { Schema, model, models, Model } from 'mongoose';

// Define the interface for the image document
interface ITicketImage {
    _id: Schema.Types.ObjectId;
    id: string;
    image: Buffer;
}

// Define the schema matching your actual DB structure
const TicketImageSchema = new Schema<ITicketImage>({
    id: { type: String, required: true, unique: true },
    image: { type: Buffer, required: true }
});

// Get or create the model
const TicketImage: Model<ITicketImage> = models.TicketImage || model<ITicketImage>('TicketImage', TicketImageSchema);

// Simple in-memory cache to store images
const imageCache: Record<string, Buffer> = {};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Connect to the database
    await connectDB();

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: "Valid image ID is required" });
    }

    if (req.method === "DELETE") {
        try {
            const deletedImage = await TicketImage.findOneAndDelete({ id: id });

            if (!deletedImage) {
                console.log('Image not found for ID:', id);
                return res.status(404).json({ message: "Image not found" });
            }

            console.log('Image deleted:', deletedImage.id);
            return res.status(200).json({ message: "Image deleted successfully" });

        } catch (error) {
            console.error("Error deleting image:", error);
            return res.status(500).json({ message: "Error deleting image" });
        }
    }

    // Handle GET requests as before
    if (req.method === "GET") {
        try {
            console.log('Searching for image with ID:', id);

            // Check the cache first
            if (imageCache[id]) {
                console.log('Image retrieved from cache for ID:', id);
                res.setHeader("Content-Type", "image/jpeg");
                res.setHeader('Cache-Control', 'public, max-age=3600, immutable'); // Cache for 1 hour
                return res.send(imageCache[id]);
            }

            // Explicitly query by the 'id' field, not _id
            const imageDoc = await TicketImage.findOne({ id: id });

            if (!imageDoc) {
                console.log('Image not found for ID:', id);
                return res.status(404).json({ message: "Image not found" });
            }

            console.log('Image found:', imageDoc.id);

            // Store the image in the cache
            imageCache[id] = imageDoc.image;

            // Set the appropriate content type and caching headers
            res.setHeader("Content-Type", "image/jpeg");
            res.setHeader('Cache-Control', 'public, max-age=3600, immutable'); // Cache for 1 hour

            // Send the image data
            return res.send(imageDoc.image);

        } catch (error) {
            console.error("Error retrieving image:", error);
            return res.status(500).json({ message: "Error retrieving image" });
        }
    }
    
    if (req.method === "PUT") {
        try {
            if (!req.body.image) {
                return res.status(400).json({ message: "Image data is required" });
            }

            const imageBuffer = await new Promise<Buffer>((resolve, reject) => {
                const chunks: Buffer[] = [];
                req.body.image.on('data', (chunk: Buffer) => chunks.push(chunk));
                req.body.image.on('end', () => resolve(Buffer.concat(chunks)));
                req.body.image.on('error', reject);
            });

            const updatedImage = await TicketImage.findOneAndUpdate(
                { id: id },
                { image: imageBuffer },
                { new: true } // Return the updated document
            );

            if (!updatedImage) {
                console.log('Image not found for ID:', id);
                return res.status(404).json({ message: "Image not found" });
            }

            console.log('Image updated:', updatedImage.id);
            return res.status(200).json({ message: "Image updated successfully" });

        } catch (error) {
            console.error("Error updating image:", error);
            return res.status(500).json({ message: "Error updating image" });
        }
    }

    // If the method is not allowed
    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}