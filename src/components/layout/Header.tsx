"use client";

import React from "react";
import Link from "next/link";
import { Building, ShieldCheck, LogIn, LogOut, UserCheck, ShieldAlert, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Header() {
  const {
    user,
    isAdmin,
    isVerifiedResident,
    logout,
    toggleAdminRole,
    setIsLoginModalOpen,
    setIsVerificationModalOpen,
  } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3 shrink-0">
      <div className="flex items-center justify-between">
        {/* 로고 & 타이틀 */}
        <Link href="/notices" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-extrabold text-card-foreground tracking-tight">유니크 센트럴</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                입대의
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">입주민대표회의 공식</p>
          </div>
        </Link>

        {/* 사용자 상태 / 로그인 버튼 */}
        <div className="flex items-center space-x-1.5">
          {user ? (
            <div className="flex items-center space-x-1.5">
              {/* 관리자 / 입주민 전환 버튼 */}
              <button
                onClick={toggleAdminRole}
                className="text-[10px] px-2 py-1 rounded-lg border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition flex items-center space-x-1"
                title="관리자/입주민 모드 전환"
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <span className="font-bold text-primary">관리자(ON)</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3 h-3 text-muted-foreground" />
                    <span>입주민</span>
                  </>
                )}
              </button>

              {/* 단톡방 인증 뱃지 or 인증하기 버튼 */}
              {isVerifiedResident ? (
                <Badge variant="success" className="text-[10px] px-1.5 py-0.5">
                  {user.roomNumber || "인증완료"}
                </Badge>
              ) : (
                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-amber-500 text-white font-semibold flex items-center space-x-1 shadow-sm hover:bg-amber-600 animate-pulse"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>단톡방 인증</span>
                </button>
              )}

              {/* 로그아웃 버튼 */}
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="kakao"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs h-8 px-2.5 rounded-lg font-bold flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>카카오 로그인</span>
            </Button>
          )}
        </div>
      </div>

      {/* 미인증 상태 배너 알림 */}
      {user && !isVerifiedResident && (
        <div
          onClick={() => setIsVerificationModalOpen(true)}
          className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition"
        >
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-medium text-[11px]">
              단톡방 인증코드를 입력하시면 정회원으로 전환됩니다.
            </span>
          </div>
          <span className="text-[10px] font-bold underline shrink-0 ml-1">인증하기</span>
        </div>
      )}
    </header>
  );
}
