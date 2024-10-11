import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

const generateRandomId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export default function Payment() {
  const [status, setStatus] = useState('pending');

  const [paymentId, setPaymentId] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    const paymentId = generateRandomId();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const link = `${apiUrl}/api/make-payment?payment_id=${encodeURIComponent(paymentId)}`;
    const statusLink = `/api/payment-status?payment_id=${paymentId}`;

    setPaymentId(paymentId)
    setLink(link)

    const checkStatus = setInterval(() => {
      fetch(statusLink)
      .then((res) => res.json())
      .then(data => {
          if (data.status == "paid") {
            setStatus('validated');
            if (audioRef.current) {
              audioRef.current.play()
            }
            clearInterval(checkStatus);
          }
      })
    }, 1000)

    return () => {
      clearInterval(checkStatus);
    };
  }, []);

  const audioRef = useRef<HTMLAudioElement>(null)

  return (
    <div>
      <audio ref={audioRef} src="/sounds/cash-register.mp3" preload="auto" />
      {status === 'pending' ? (
        <>
          <p>Waiting for payment id {paymentId}...</p>
          <QRCodeCanvas
            value={link}
            size={256}
            includeMargin={true}
          />
        </>
      ) : (
          <p>Payment successfully!</p>
        )}
      { 
      }
    </div>
  );
}
