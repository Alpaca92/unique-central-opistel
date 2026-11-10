"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, ReceiptText, Wallet, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: "/notices",
      label: "공지사항",
      icon: Megaphone,
      isActive: pathname.startsWith("/notices"),
    },
    {
      href: "/maintenance",
      label: "관리비",
      icon: ReceiptText,
      isActive: pathname.startsWith("/maintenance"),
    },
    {
      href: "/funds",
      label: "운영회비",
      icon: Wallet,
      isActive: pathname.startsWith("/funds"),
    },
    {
      href: "/faq",
      label: "FAQ",
      icon: HelpCircle,
      isActive: pathname.startsWith("/faq"),
    },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 shrink-0">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive ? "scale-110 text-primary" : "text-muted-foreground"
                  )}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-6 h-0.5 bg-primary rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
