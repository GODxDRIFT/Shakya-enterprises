import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { orderService } from '../../src/firebase';

const CASHFREE_SECRET = process.env.CASHFREE_SECRET_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-cashfree-signature'] as string;
  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  const body = JSON.stringify(req.body);
  const expectedSignature = crypto.createHmac('sha256', CASHFREE_SECRET).update(body).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const { order_id, payment_status } = req.body;

  if (!order_id || !payment_status) {
    return res.status(400).json({ error: 'Missing order_id or payment_status' });
  }

  try {
    // Update order status in Firestore
    await orderService.updateStatus(order_id, payment_status === 'SUCCESS' ? 'PAID' : 'failed');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}