
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
app.use(express.json());

const CF_APP_ID     = process.env.CASHFREE_APP_ID!;
const CF_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CF_MODE       = (process.env.CASHFREE_MODE || 'sandbox') as 'sandbox' | 'production';
const CF_BASE       = CF_MODE === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';
const APP_URL       = process.env.APP_URL || 'http://localhost:3000';

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, mode: CF_MODE }));

// ─── Create Cashfree Order → returns payment_session_id ───────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { orderId, amountINR, customer } = req.body as {
      orderId: string;
      amountINR: number;
      customer: { name: string; email: string; phone: string };
    };

    const body = {
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
        notify_url: `${APP_URL}/api/webhook`, // optional
      },
    };

    const cfRes = await fetch(`${CF_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CF_APP_ID,
        'x-client-secret': CF_SECRET_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await cfRes.json() as any;

    if (!cfRes.ok) {
      console.error('Cashfree error:', data);
      return res.status(400).json({ error: data.message || 'Order creation failed' });
    }

    res.json({
      orderId: data.order_id,
      sessionId: data.payment_session_id,
      cfOrderId: data.cf_order_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Get Order Status from Cashfree ───────────────────────────────────────
app.get('/api/order-status/:orderId', async (req, res) => {
  try {
    const cfRes = await fetch(`${CF_BASE}/orders/${req.params.orderId}`, {
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CF_APP_ID,
        'x-client-secret': CF_SECRET_KEY,
      },
    });
    const data = await cfRes.json() as any;
    res.json({
      orderId: data.order_id,
      status: data.order_status,   // PAID | ACTIVE | EXPIRED
      amount: data.order_amount,
      currency: data.order_currency,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => console.log(`✅ Shakya Server running → http://localhost:${PORT}  [Cashfree ${CF_MODE}]`));
