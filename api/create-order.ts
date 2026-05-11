// api/create-order.ts  ← place this in your /api/ folder (for Vercel)
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── env vars (set these in Vercel Dashboard → Settings → Environment Variables)
const CF_APP_ID     = process.env.CASHFREE_APP_ID?.trim();
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY?.trim();
const CF_MODE       = process.env.CASHFREE_MODE || 'sandbox';
const CF_BASE       = CF_MODE === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';
const APP_URL       = process.env.APP_URL || 'http://localhost:3000';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── credentials check FIRST, before anything else
  if (!CF_APP_ID || !CF_SECRET_KEY) {
    return res.status(500).json({
      error: 'Payment credentials not configured. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY in Vercel environment variables.',
    });
  }

  try {
    const { orderId, amountINR, customer } = req.body as {
      orderId: string;
      amountINR: number;
      customer: { name: string; email: string; phone: string };
    };

    const cfRes = await fetch(`${CF_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CF_APP_ID,
        'x-client-secret': CF_SECRET_KEY,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amountINR,
        order_currency: 'INR',
        customer_details: {
          customer_id: `cust_${Date.now()}`,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
        },
        order_meta: {
          return_url: `${APP_URL}?order_id={order_id}`,
        },
      }),
    });

    const data = await cfRes.json() as any;

    if (!cfRes.ok) {
      console.error('Cashfree API error:', data);
      return res.status(400).json({ error: data.message || 'Order creation failed' });
    }

    return res.json({
      orderId: data.order_id,
      sessionId: data.payment_session_id,
      cfOrderId: data.cf_order_id,
    });
  } catch (err: any) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}