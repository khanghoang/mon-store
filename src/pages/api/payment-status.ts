export default function handler(req, res) {
  const { payment_id: paymentId } = req.query;
  if (!paymentId) {
      return res.status(400).json({ error: `invalid payment id` });
  }

  const {payments} = require('../../utils/global');
  const payment = payments[paymentId]
  if (payment && payment.status === 'paid') {
    return res.status(200).json({ status: `paid` });
  }

  return res.status(200).json({ status: `pending` });
}
