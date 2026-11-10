"use client";

import React from "react";
import { Megaphone, ReceiptText, Wallet, HelpCircle } from "lucide-react";
import { ActiveTab } from "@/types";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: "notices" as ActiveTab,
      label: "공지사항",
      icon: Megaphone,
    },
    {
      id: "maintenance" as ActiveTab,
      label: "관리비",
      icon: ReceiptText,
    },
    {
      id: "funds" as ActiveTab,
      label: "운영회비",
      icon: Wallet,
    },
    {
      id: "faq" as ActiveTab,
      label: "FAQ",
      icon: HelpCircle,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shrink-0">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative",
                isActive
                  ? "text-blue-900 font-bold"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive ? "scale-110 text-blue-900" : "text-slate-400"
                  )}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-6 h-0.5 bg-blue-900 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
