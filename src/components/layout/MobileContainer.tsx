"use client";

import React from "react";
import { Building2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function MobileContainer({ children }: { children: React.ReactNode }) {
  const { groupPasscode } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background flex justify-center items-start lg:py-6">
      {/* PC 전용 좌측 사이드바 배너 (PC에서만 표시) */}
      <aside className="hidden xl:flex flex-col w-80 p-6 mr-8 sticky top-6 bg-card/80 backdrop-blur-md rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">유니크 센트럴</h1>
            <p className="text-xs text-primary font-semibold">입주민대표회의 공식 포털</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2 text-xs leading-relaxed text-foreground">
          <div className="flex items-center font-bold text-primary space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>투명한 공지 & 회비 공개</span>
          </div>
          <p className="text-muted-foreground">
            댓글 분쟁 없이 공지사항 전달과 관리비·운영회비의 투명한 집행 내역을 입주민분들께 정직하게 보고합니다.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 space-y-2.5 text-xs">
          <div className="flex items-center font-bold text-amber-900 space-x-1.5">
            <MessageCircle className="w-4 h-4 text-amber-600" />
            <span>단톡방 입주민 인증 안내</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            카카오톡 로그인 후, 단톡방 공지에 공유된 가입 코드를 입력하시면 입주민으로 자동 승인됩니다.
          </p>
          <div className="bg-white p-2 rounded-xl border border-amber-200 flex justify-between items-center font-mono">
            <span className="text-slate-500">현재 단톡방 코드:</span>
            <span className="font-bold text-amber-800">{groupPasscode}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border text-[11px] text-muted-foreground text-center">
          📱 본 페이지는 모바일 기기에 최적화되어 있습니다.
        </div>
      </aside>

      {/* 중앙 모바일 화면 컨테이너 (스마트폰 크기 고정, 모바일에서는 100% 핏) */}
      <main className="w-full max-w-md min-h-screen lg:min-h-[920px] lg:max-h-[95vh] bg-card text-card-foreground shadow-2xl flex flex-col relative lg:rounded-[36px] overflow-hidden border border-border">
        {children}
      </main>

      {/* PC 전용 우측 사이드바 팁 (PC에서만 표시) */}
      <aside className="hidden xl:flex flex-col w-80 p-6 ml-8 sticky top-6 bg-card/80 backdrop-blur-md rounded-3xl border border-border shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Next.js App Router 안내</span>
        </div>

        <div className="space-y-3 text-xs text-muted-foreground">
          <div className="p-3 bg-secondary rounded-xl border border-border">
            <p className="font-semibold text-foreground mb-1">1. SSR & 고유 URL 라우팅</p>
            <p>공지사항, 관리비, 회비, FAQ가 각각 고유 URL(`/notices`, `/maintenance`, `/funds`, `/faq`)을 가지며 서버 렌더링(SSR)됩니다.</p>
          </div>
          <div className="p-3 bg-secondary rounded-xl border border-border">
            <p className="font-semibold text-foreground mb-1">2. 개별 공지 딥링크 공유</p>
            <p>공지사항을 클릭하면 `/notices/[id]` 고유 주소가 생성되어 카카오톡 단톡방에 직접 링크를 공유할 수 있습니다.</p>
          </div>
          <div className="p-3 bg-secondary rounded-xl border border-border">
            <p className="font-semibold text-foreground mb-1">3. 카카오 로그인 & 관리자 모드</p>
            <p>단톡방 시크릿 코드 인증 및 상단 토글을 통한 입대의 관리자 모드 체험이 가능합니다.</p>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground text-center mt-auto">
          Unique Central Opistel Council &copy; 2026
        </div>
      </aside>
    </div>
  );
}
