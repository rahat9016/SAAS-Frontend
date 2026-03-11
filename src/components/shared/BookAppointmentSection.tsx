import logo from "@/public/logo_.png";
import { siteConfig } from "@/src/config/siteConfig";
import Image from "next/image";
import { Button } from "../ui/button";
import Paragraph from "./Paragraph";

export default function BookAppointmentSection() {
  return (
    <div className="bg-primary py-10 lg:py-20">
      <div className="container flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
          <Image
            src={logo}
            alt={siteConfig.name}
            width={300}
            height={300}
            className="w-25"
          />
          <Paragraph className="text-white lg:text-xl xl:text-2xl">
            {siteConfig.name}
          </Paragraph>
        </div>
        <Button className="bg-white hover:bg-white text-secondary px-6 py-4 h-11 cursor-pointer">
          Book Appointment →
        </Button>
      </div>
    </div>
  );
}
