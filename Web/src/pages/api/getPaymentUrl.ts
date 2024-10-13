import type { NextApiRequest, NextApiResponse } from 'next';
import { vnpay } from '@/module/vnpay'; // Import your vnpay library
import { ProductCode } from 'vnpay';

// Define the port (can be environment variable in production)
const port = process.env.PORT || 3000;

/**
 * Handles the request to build and return a payment URL for a transaction.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Retrieve the client's IP address and ensure it's treated as a string
    // const clientIp = Array.isArray(req.headers['x-forwarded-for']) 
    //   ? req.headers['x-forwarded-for'][0] // Take the first IP if it's an array
    //   : req.headers['x-forwarded-for'] || req.connection.remoteAddress || '1.1.1.1';

    // Build the payment URL
    const paymentUrl = vnpay.buildPaymentUrl(
      {
        vnp_Amount: 10000, // Amount to be charged
        vnp_IpAddr: "1.1.1.1", // Customer's IP address (asserted as string)
        vnp_TxnRef: '123456', // Unique transaction reference
        vnp_OrderInfo: 'Payment for order 123456', // Information about the order
        vnp_OrderType: ProductCode.Other, // Type of product
        vnp_ReturnUrl: `http://localhost:${port}`, // Return URL after payment
      },
      {
        logger: {
          type: 'pick', // Logging mode
          fields: ['createdAt', 'method', 'paymentUrl'], // Fields to log
          loggerFn: (data) => logToDatabase(data), // Custom logging function to save logs
        },
        withHash:true,
      },
    );

    // Return the payment URL as JSON
    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('Error building payment URL:', error); // Log any errors
    res.status(500).json({ error: 'Failed to build payment URL' });
  }
}

/**
 * Custom logging function to save logs to the database.
 * @param {any} data - The data to log.
 */
function logToDatabase(data: any) {
  // Implement your logic to save log data to the database
  console.log('Logging to database:', data);
}
