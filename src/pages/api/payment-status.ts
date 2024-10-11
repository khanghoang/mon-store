import { payments } from '@/utils/global';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { payment_id: paymentId } = req.query;
  if (!paymentId) {
      return res.status(400).json({ error: `invalid payment id` });
  }

  const payment = payments[paymentId as string]
  if (payment && payment.status === 'paid') {
    return res.status(200).json({ status: `paid` });
  }

  return res.status(200).json({ status: `pending` });
}
