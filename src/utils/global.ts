type PaymentItem = {
  status: "pending" | "paid"
}

type Payments = {
  [key: string]: PaymentItem
}

export const payments: Payments = {}
