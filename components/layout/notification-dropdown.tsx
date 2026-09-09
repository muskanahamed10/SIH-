"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationDropdown() {
  const t = useTranslations("common");
  const notifT = useTranslations("notificationsData");
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: "notif-1",
      title: notifT("item1Title"),
      desc: notifT("item1Desc"),
      time: notifT("item1Time"),
      unread: true,
    },
    {
      id: "notif-2",
      title: notifT("item2Title"),
      desc: notifT("item2Desc"),
      time: notifT("item2Time"),
      unread: true,
    },
    {
      id: "notif-3",
      title: notifT("item3Title"),
      desc: notifT("item3Desc"),
      time: notifT("item3Time"),
      unread: false,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-200 hover:text-white rounded-md hover:bg-blue-900/60 transition focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label={t("notifications")}
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 ring-2 ring-[#0B2545]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <span className="font-bold text-sm text-slate-900">{t("notifications")}</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-blue-800 hover:text-blue-900 hover:bg-blue-50 px-2 flex items-center gap-1"
                onClick={() => setUnreadCount(0)}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t("markAllRead")}</span>
              </Button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 text-left transition hover:bg-slate-50 ${
                  n.unread && unreadCount > 0 ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-xs text-slate-900 leading-tight">
                    {n.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5 shrink-0">
                    <Clock className="w-3 h-3" />
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {n.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
