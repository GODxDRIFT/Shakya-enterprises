// api/order-status/[orderId].ts  ← place in /api/order-status/ folder
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CF_APP_ID     = process.env.CASHFREE_APP_ID?.trim();
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY?.trim();
const CF_MODE       = process.env.CASHFREE_MODE || 'sandbox';
const CF_BASE       = CF_MODE === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!CF_APP_ID || !CF_SECRET_KEY) {
    return res.status(500).json({ error: 'Payment credentials not configured' });
  }

  try {
    const { orderId } = req.query;
    const cfRes = await fetch(`${CF_BASE}/orders/${orderId}`, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CF_APP_ID,
        'x-client-secret': CF_SECRET_KEY,
      },
    });
    const data = await cfRes.json() as any;
    return res.json({
      orderId: data.order_id,
      status: data.order_status,
      amount: data.order_amount,
      currency: data.order_currency,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}