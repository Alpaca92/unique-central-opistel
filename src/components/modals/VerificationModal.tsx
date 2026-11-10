"use client";

import React, { useState } from "react";
import { KeyRound, Building, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ResidentType } from "@/types";

export function VerificationModal() {
  const {
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    verifyResident,
    groupPasscode,
    user,
  } = useAuth();

  const [passcode, setPasscode] = useState("");
  const [building, setBuilding] = useState("101동");
  const [roomNumber, setRoomNumber] = useState("");
  const [residentType, setResidentType] = useState<ResidentType>("owner");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const result = verifyResident(passcode, building, roomNumber, residentType);
    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setIsVerificationModalOpen(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
      <DialogHeader>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-2 border border-blue-100">
          <KeyRound className="w-6 h-6 text-blue-600" />
        </div>
        <DialogTitle className="text-center text-lg font-bold text-slate-900">
          단톡방 입주민 인증
        </DialogTitle>
        <DialogDescription className="text-center text-xs text-slate-500">
          우리 오피스텔 공식 단톡방에 참여 중인 입주민분들만 가입 및 열람이 가능합니다.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 my-2">
        {/* 단톡방 인증코드 입력 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>단톡방 공지 인증코드</span>
            <span className="text-[11px] font-normal text-blue-600">단톡방 상단 공지 확인</span>
          </label>
          <Input
            type="text"
            placeholder="단톡방 공지에 기재된 영문/숫자 코드"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="uppercase font-mono tracking-wider font-semibold"
            required
          />
          <div className="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>💡 데모 기본 암호:</span>
            <code className="font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {groupPasscode}
            </code>
          </div>
        </div>

        {/* 동 및 호수 입력 */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              동 (동/건물)
            </label>
            <Input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="예: 101동"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              호수 <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="예: 1204호"
              required
            />
          </div>
        </div>

        {/* 거주 형태 */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            입주민 거주 형태
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResidentType("owner")}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                residentType === "owner"
                  ? "border-blue-900 bg-blue-50 text-blue-900"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              소유자 (집주인)
            </button>
            <button
              type="button"
              onClick={() => setResidentType("tenant")}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                residentType === "tenant"
                  ? "border-blue-900 bg-blue-50 text-blue-900"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              임차인 (세입자)
            </button>
          </div>
        </div>

        {/* 에러 및 성공 피드백 */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 제출 버튼 */}
        <Button type="submit" className="w-full text-sm font-bold h-11">
          인증 완료 및 가입하기
        </Button>
      </form>
    </Dialog>
  );
}
