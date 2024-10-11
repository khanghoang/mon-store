'use client'

import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function WaitForValidation() {
  const [status, setStatus] = useState('pending');

  const [paymentId, setPaymentId] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const paymentId = uuidv4();
    const host = '192.168.86.31'
    const port = '3000'
    const link = `http://${host}:${port}/api/make-payment?payment_id=${encodeURIComponent(paymentId)}`;
    const statusLink = `/api/payment-status?payment_id=${paymentId}`;

    setPaymentId(paymentId)
    setLink(link)

    const checkStatus = setInterval(() => {
      fetch(statusLink)
      .then((res) => res.json())
      .then(data => {
          if (data.status == "paid") {
            setStatus('validated');
          }
      })
    }, 1000)

    return () => {
      clearInterval(checkStatus);
    };
  }, []);

  return (
    <div>
      <h1>Payment</h1>
      {status === 'pending' ? (
        <p>Waiting for payment id {paymentId}...</p>
      ) : (
        <p>Payment successfully!</p>
      )}
      { link && 
        <QRCodeCanvas
          value={link}
          size={256}
          includeMargin={true}
        />
      }
    </div>
  );
}
