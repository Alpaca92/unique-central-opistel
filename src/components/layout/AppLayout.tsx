"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { LoginModal } from "@/components/modals/LoginModal";
import { VerificationModal } from "@/components/modals/VerificationModal";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <MobileContainer>
          {/* 상단 고정 헤더 */}
          <Header />

          {/* 라우트별 페이지 렌더링 영역 */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* 하단 탭 라우팅 네비게이션 */}
          <BottomNav />

          {/* 전역 모달들 */}
          <LoginModal />
          <VerificationModal />
        </MobileContainer>
      </DataProvider>
    </AuthProvider>
  );
}
