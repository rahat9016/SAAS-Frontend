import dashboard from "@/public/icons/dashboard.svg";
import HealthPackages from "@/public/icons/HealthPackages.svg";
import Categories from "@/public/icons/Categories.svg";

import Corporate from "@/public/icons/Corporate.svg";
import HeroManagement from "@/public/icons/HeroManagement.svg";

import { StaticImageData } from "next/image";
export interface MenuItem {
  label: string;
  icon: StaticImageData;
  href?: string;
  children?: { label: string; href: string }[];
}

export function getMenuItems(): MenuItem[] {
  const menuItems: (MenuItem | false)[] = [
    { label: "Dashboard", icon: dashboard, href: "/admin" },
    {
      label: "Categories",
      icon: Categories,
      children: [
        { label: "Parent Category", href: "/admin/parent-category" },
        { label: "Category", href: "/admin/category" },
        { label: "Sub Category", href: "/admin/sub-category" },
      ],
    },
    // {
    //   label: "Appointment",
    //   icon: Appointment,
    //   href: "/admin/all-appointments",
    // },
    // { label: "Doctors", icon: Doctors, href: "/admin/doctors" },
    // {
    //   label: "Health Packages",
    //   icon: HealthPackages,
    //   href: "/admin/health-packages",
    // },
    // { label: "Specialties", icon: Specialties, href: "/admin/specialties" },
    // { label: "Membership", icon: Membership, href: "/admin/membership" },
    // { label: "Blogs", icon: Blogs, href: "/admin/blogs" },
    // { label: "Career", icon: Career, href: "/admin/applicant-list" },
    // {
    //   label: "Contact & Support",
    //   icon: ContactSupport,
    //   href: "/admin/contact-support-list",
    // },
    // {
    //   label: "User Management",
    //   icon: UserManagement,
    //   href: "/admin/user-management",
    // },
    {
      label: "Brands",
      icon: Corporate,
      href: "/admin/brands",
    },
    {
      label: "Product Management",
      icon: HealthPackages,
      children: [
        { label: "Product", href: "/admin/products" },
        { label: "Attributes", href: "/admin/products/attributes" },
        { label: "Attribute Values", href: "/admin/products/attribute-values" },
      ],
    },
    {
      label: "Hero Management",
      icon: HeroManagement,
      href: "/admin/hero-management",
    },
    {
      label: "Content Management",
      icon: HeroManagement,
      children: [
        { label: "Media Gallery", href: "/admin/media-gallery" },
        { label: "Banner & Poster", href: "/admin/banner-poster" },
      ],
    },
    // { label: "Corporate", icon: Corporate, href: "/admin/corporate" },
    

    // {
    //   label: "Events",
    //   icon: CalendarDays,
    //   // children: hasPermission
    //   //   ? [
    //   //       { label: "Event List", href: "/admin/events/events-list" },
    //   //       {
    //   //         label: "Events Categories",
    //   //         href: "/admin/events/events-categories",
    //   //       },
    //   //       { label: "Events Tags", href: "/admin/events/events-tags" },
    //   //     ]
    //   //   : [{ label: "Event List", href: "/admin/events/events-list" }],
    // },
  ];

  return menuItems.filter(Boolean) as MenuItem[];
}
