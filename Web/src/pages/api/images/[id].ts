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

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Valid image ID is required" });
        }

        // Connect to the database
        await connectDB();

        console.log('Searching for image with string ID:', id);

        // Explicitly query by the 'id' field, not _id
        const imageDoc = await TicketImage.findOne({ id: id });

        if (!imageDoc) {
            console.log('Image not found for ID:', id);
            return res.status(404).json({ message: "Image not found" });
        }

        console.log('Image found:', imageDoc.id);

        // Set the appropriate content type
        res.setHeader("Content-Type", "image/jpeg");
        
        // Send the image data
        return res.send(imageDoc.image);

    } catch (error) {
        console.error("Error retrieving image:", error);
        return res.status(500).json({ message: "Error retrieving image" });
    }
}