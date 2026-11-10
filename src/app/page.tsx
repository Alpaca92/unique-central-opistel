"use client";

import React, { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { NoticesView } from "@/components/views/NoticesView";
import { MaintenanceView } from "@/components/views/MaintenanceView";
import { OperatingFundsView } from "@/components/views/OperatingFundsView";
import { FAQView } from "@/components/views/FAQView";
import { LoginModal } from "@/components/modals/LoginModal";
import { VerificationModal } from "@/components/modals/VerificationModal";
import { ActiveTab } from "@/types";

function MainContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("notices");

  return (
    <MobileContainer>
      {/* 모바일 상단 헤더 */}
      <Header />

      {/* 탭 본문 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === "notices" && <NoticesView />}
        {activeTab === "maintenance" && <MaintenanceView />}
        {activeTab === "funds" && <OperatingFundsView />}
        {activeTab === "faq" && <FAQView />}
      </div>

      {/* 모바일 하단 탭바 */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 모달들 */}
      <LoginModal />
      <VerificationModal />
    </MobileContainer>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainContent />
      </DataProvider>
    </AuthProvider>
  );
}
