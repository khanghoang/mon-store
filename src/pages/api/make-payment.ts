import { payments } from '@/utils/global';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { payment_id: paymentId } = req.query;
  if (!paymentId) {
      return res.status(400).json({ error: `invalid payment id` });
  }
  payments[paymentId as string] = { status: 'paid' }
  return res.status(200).json({ message: `${paymentId} paid. payments ${JSON.stringify(payments)}` });
}

