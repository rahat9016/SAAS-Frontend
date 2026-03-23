export interface IPaymentCard {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string;
  isDefault: boolean;
}

export const dummyPaymentMethods: IPaymentCard[] = [
  {
    id: "pm-1",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2027,
    holderName: "Minhajur Rahman",
    isDefault: true,
  },
  {
    id: "pm-2",
    brand: "mastercard",
    last4: "8888",
    expMonth: 6,
    expYear: 2028,
    holderName: "Minhajur Rahman",
    isDefault: false,
  },
  {
    id: "pm-3",
    brand: "amex",
    last4: "3456",
    expMonth: 3,
    expYear: 2026,
    holderName: "Minhajur Rahman",
    isDefault: false,
  },
];
