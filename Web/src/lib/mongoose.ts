import mongoose, { Document, Model } from "mongoose";

// Connect to MongoDB and specify the database
const connectDB = async (): Promise<boolean> => {
    // Check if the connection is already established
    if (mongoose.connections[0].readyState) {
        return true;
    }
    try {
        // Connect to the 'ticketResell' database
        await mongoose.connect(`${process.env.MONGODB_URI}/ticketResell`);
        console.log("Connected to MongoDB - ticketResell");
        return true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return false;
    }
};
interface IOTP extends Document {
    userId: string;         // ID của người dùng
    otp: string;            // Mã OTP
    expiresAt: Date;        // Thời gian hết hạn của OTP
}

// Create the schema for OTP
const otpSchema = new mongoose.Schema<IOTP>({
    userId: { type: String, required: true },  // ID người dùng
    otp: { type: String, required: true },     // Mã OTP
    expiresAt: { type: Date, required: true }, // Thời gian hết hạn
});

// Create the OTP model
const Otp: Model<IOTP> = mongoose.models.Otp || mongoose.model<IOTP>("Otp", otpSchema);

// Function to insert OTP into the OTP collection
const insertOtp = async (userId: string, otp: string, expiresAt: Date): Promise<void> => {
    try {
        const otpRecord = new Otp({
            userId,
            otp,
            expiresAt,
        });
        await otpRecord.save(); // Lưu OTP vào cơ sở dữ liệu
        console.log("OTP saved to database");
    } catch (error) {
        console.error("Error saving OTP:", error);
    }
};

// Function to fetch OTP by userId from the database
const fetchOtpFromDb = async (userId: string): Promise<string | null> => {
    try {
        const otpRecord = await Otp.findOne({
            userId,
            expiresAt: { $gte: new Date() }, // Chỉ lấy OTP chưa hết hạn
        });

        return otpRecord ? otpRecord.otp : null;
    } catch (error) {
        console.error("Error fetching OTP:", error);
        return null;
    }
};

// Define the IImage interface
interface ITicketImage extends Document {
    id: string;         // Add an ID field if needed (as per your requirement)
    image: Buffer;     // Store image data as Buffer
}

// Create the schema for ticketImage
const ticketImageSchema = new mongoose.Schema<ITicketImage>({
    id: { type: String, required: true },  // ID field
    image: { type: Buffer, required: true }, // Image data field
});

// Create the TicketImage model
const TicketImage: Model<ITicketImage> = mongoose.models.TicketImage || mongoose.model<ITicketImage>("TicketImage", ticketImageSchema);

// Function to insert an image into the ticketImage collection
const insertTicketImage = async (id: string, imageData: Buffer, contentType: string): Promise<void> => {
    try {
        const ticketImage = new TicketImage({
            id,            // Set the ID
            image: imageData, // Store the image data
        });
        await ticketImage.save(); // Save the image to the database
        console.log("Image saved to ticketImage collection");
    } catch (error) {
        console.error("Error saving image:", error);
    }
};

// Export the functions and model
export { connectDB, TicketImage, insertTicketImage,Otp, insertOtp, fetchOtpFromDb };
