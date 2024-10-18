import crypto from 'crypto';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import type { NextApiRequest, NextApiResponse } from 'next';

const secretKey = 'qxdBfW31GnjfHG621DCSquug8bRiFy38';

// Function to encrypt data
const encryptData = (data: string): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Function to generate OTP and send via EmailJS
export const getOTP = async (name: string, email: string, userID: string) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const templateParams = {
        to_name: name,
        to_email: email,
        otp: generatedOtp,
    };

    try {
        // Send OTP via email
        await emailjs.send(
            'service_d76v3rv',
            'template_juvp2i4',
            templateParams,
            'RNLODJWvSPCIi0CTv'
        );

        // Encrypt user email and OTP
        const dataToEncrypt = `${email}|${generatedOtp}`;
        const encryptedData = encryptData(dataToEncrypt);

        // Send encrypted data to the backend API
        const response = await axios.post('http://localhost:5296/api/Authentication/putOTP', { encryptedData }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return { success: true, message: 'OTP sent and encrypted successfully!' };
    } catch (error) {
        console.error('Error in sending OTP or encrypting data:', error);
        return { success: false, message: 'Failed to send OTP or encrypt data.' };
    }
};

// API handler for OTP verification and registration
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { email, otp, username, password } = req.body;
        console.log('Received data:', { email, otp, username, password });

        // Validate input
        if (!email || !otp || !username || !password) {
            console.error("Validation error: All fields are required.");
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Encrypt data
        const dataToEncrypt = `${email}|${otp}`;
        const encryptedData = encryptData(dataToEncrypt);
        console.log('Encrypted data:', encryptedData);

        try {
            // Send encrypted data to the putOTP API

            // Proceed with registration using fetch instead of axios
            const registerResponse = await fetch('http://localhost:5296/api/Authentication/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserId: email,
                    Username: username,
                    Password: password,
                    Gmail: email,
                    OTP: otp
                })
            });

            const registerData = await registerResponse.json();
            console.log('Register response:', registerData);

            if (registerResponse.ok && registerData.statusCode === 200) {
                return res.status(200).json({ success: true, message: "Registration successful" });
            } else {
                return res.status(400).json({ success: false, message: registerData.message });
            }

        } catch (error) {
            console.error('Error during OTP verification or registration:', error);
            return res.status(500).json({ success: false, message: error.toString() });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
