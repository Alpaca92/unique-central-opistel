"use client";

import React from "react";
import { MessageCircle, ShieldCheck, Sparkles, Building, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export function LoginModal() {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    loginWithKakao,
    simulateKakaoLogin,
    groupPasscode,
  } = useAuth();

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogHeader>
        <div className="w-12 h-12 rounded-2xl bg-kakao text-kakao-foreground flex items-center justify-center mx-auto mb-2 shadow-sm">
          <MessageCircle className="w-7 h-7 fill-current" />
        </div>
        <DialogTitle className="text-center text-xl font-extrabold text-slate-900">
          카카오톡으로 로그인
        </DialogTitle>
        <DialogDescription className="text-center text-xs text-slate-500">
          유니크 센트럴 오피스텔 입주민을 위한 소통 공간입니다.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 my-2">
        {/* 단톡방 연동 안내 배너 */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center font-bold space-x-1.5 text-amber-900">
            <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
            <span>단톡방 참여 인원 인증 안내</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            카카오톡 로그인 후, 우리 오피스텔 공식 단톡방 공지에 게시된 <span className="font-semibold text-slate-900">인증코드</span>를 입력하시면 입주민 정회원으로 가입됩니다.
          </p>
        </div>

        {/* 카카오 공식 로그인 버튼 */}
        <Button
          variant="kakao"
          size="lg"
          className="w-full text-base font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2"
          onClick={loginWithKakao}
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>카카오 로그인</span>
        </Button>

        {/* 데모/테스트 편의를 위한 빠른 체험 */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>테스트용 간편 로그인</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateKakaoLogin("resident")}
              className="text-xs font-semibold hover:border-blue-400"
            >
              입주민으로 체험
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => simulateKakaoLogin("admin")}
              className="text-xs font-semibold bg-blue-50 text-blue-900 hover:bg-blue-100"
            >
              입대의 관리자로 체험
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
