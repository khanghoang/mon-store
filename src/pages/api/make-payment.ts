export default function handler(req, res) {
  const { payment_id: paymentId } = req.query;
  if (!paymentId) {
      return res.status(400).json({ error: `invalid payment id` });
  }
  const {payments} = require('../../utils/global');
  payments[paymentId] = { status: 'paid' }
  return res.status(200).json({ message: `${paymentId} paid. payments ${JSON.stringify(payments)}` });
}

