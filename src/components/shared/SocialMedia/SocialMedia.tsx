"use client";
import appointment from "@/public/icons/appointment.svg";
import file from "@/public/icons/File.svg";
import hotline from "@/public/icons/Hotline.svg";
import ins from "@/public/icons/ins.svg";
import wp from "@/public/icons/wp.svg";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

const socials = [
  { name: "Whatsapp", href: "#", icon: wp },
  { name: "Whatsapp", href: "#", icon: hotline },
  { name: "Instagram", href: "#", icon: ins },
  { name: "Doctor Appointment", href: "#", icon: appointment },
  { name: "Online Report", href: "#", icon: file },
  { name: "16254", href: "#", icon: hotline },
];

export default function SocialMedia() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
      {socials.map((item) => {
        return (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center
             border hover:bg-primary transition group"
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={18}
                    height={18}
                    className="transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-primary mr-1">
                {item.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
