"use client";

import {
  ArrowLeft,
  Bell,
  CircleHelp,
  Image as ImageIcon,
  ListChecks,
  Settings,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ICON_BUTTON_CLASS =
  "p-2 rounded-md text-secondary-dark hover:bg-gray-100 hover:text-primary transition-colors";

export default function HeaderActionIcons() {
  const router = useRouter();

  return (
    <div className="hidden lg:flex items-center gap-1">
      <button
        type="button"
        aria-label="Go back"
        title="Go back"
        onClick={() => router.back()}
        className={ICON_BUTTON_CLASS}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Tasks"
        title="Tasks"
        className={ICON_BUTTON_CLASS}
      >
        <ListChecks className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Notifications"
        title="Notifications"
        className={ICON_BUTTON_CLASS}
      >
        <Bell className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Favorites"
        title="Favorites"
        className={ICON_BUTTON_CLASS}
      >
        <Star className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Media"
        title="Media"
        className={ICON_BUTTON_CLASS}
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Help"
        title="Help"
        className={ICON_BUTTON_CLASS}
      >
        <CircleHelp className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Settings"
        title="Settings"
        className={ICON_BUTTON_CLASS}
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
