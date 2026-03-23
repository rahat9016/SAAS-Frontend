import { IShippingAddress } from "@/src/types/ecommerce/order";

export interface IAddress extends IShippingAddress {
  id: string;
  label: string;
}

export const dummyAddresses: IAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "Minhajur Rahman",
    phone: "+880 1711-358400",
    email: "minhaj@example.com",
    addressLine1: "House 12, Road 12, Sector 11",
    addressLine2: "Uttara",
    city: "Dhaka",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1230",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    fullName: "Minhajur Rahman",
    phone: "+880 1711-358400",
    addressLine1: "Level 5, Tower B, Junction Business Centre",
    addressLine2: "Gulshan 2",
    city: "Dhaka",
    district: "Dhaka",
    division: "Dhaka",
    postalCode: "1212",
    isDefault: false,
  },
  {
    id: "addr-3",
    label: "Family",
    fullName: "Rahima Begum",
    phone: "+880 1911-456789",
    addressLine1: "78 Station Road, Sadar",
    city: "Rajshahi",
    district: "Rajshahi",
    division: "Rajshahi",
    postalCode: "6000",
    isDefault: false,
  },
];
