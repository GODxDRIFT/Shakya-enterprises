// api/create-order.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CF_APP_ID     = process.env.CASHFREE_APP_ID!;
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CF_MODE       = process.env.CASHFREE_MODE || 'sandbox';
const CF_BASE       = CF_MODE === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';
const CF_APP_ID = process.env.CASHFREE_APP_ID?.trim();
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY?.trim();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { orderId, amountINR, customer } = req.body;

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
    if (!CF_APP_ID || !CF_SECRET_KEY) {
  return res.status(500).json({ 
    error: 'Payment credentials not configured' 
  });
}

    if (!cfRes.ok) {
      return res.status(400).json({ error: data.message || 'Order creation failed' });
    }

    res.json({
      orderId: data.order_id,
      sessionId: data.payment_session_id,
      cfOrderId: data.cf_order_id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
  
}