"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Car,
  PhoneCall,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  KeyRound,
  ShieldCheck,
  Plus,
  Edit3,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { FAQItem, FAQCategory } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";

export function FAQView() {
  const { faqs, addFAQ, deleteFAQ } = useData();
  const { isAdmin, groupPasscode, updateGroupPasscode } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openAccordionIds, setOpenAccordionIds] = useState<Record<string, boolean>>({
    "faq-groupchat-1": true,
    "faq-parking-1": true,
  });

  // 관리자 단톡방 비밀번호 변경 상태
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [newPasscode, setNewPasscode] = useState(groupPasscode);

  const categories = [
    { id: "all", label: "전체 안내" },
    { id: "groupchat", label: "💬 카톡 단톡방" },
    { id: "parking", label: "🚗 주차 안내" },
    { id: "management", label: "🏢 관리사무소" },
    { id: "living", label: "♻️ 생활 수칙" },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordionIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
            <HelpCircle className="w-5 h-5 text-blue-900" />
            <span>입주민 FAQ & 생활안내</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            단톡방 링크, 월 주차 시간 및 긴급 연락처
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setNewPasscode(groupPasscode);
              setIsPasscodeModalOpen(true);
            }}
            className="text-xs font-bold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center space-x-1"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>단톡방 암호 관리</span>
          </Button>
        )}
      </div>

      {/* 🌟 1. 카카오톡 단톡방 특급 안내 배너 (핵심 요구사항) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FEE500] to-[#FDD835] p-4 text-[#191919] shadow-md space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-black/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">유니크 센트럴 공식 단톡방</h3>
              <p className="text-[11px] opacity-80">실시간 공지 및 입주민 소통 오픈채팅</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10">
            입주민 전용
          </span>
        </div>

        {/* 단톡방 입장 비밀번호 복사 카드 */}
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-semibold">단톡방 참여 비밀번호</p>
            <p className="text-sm font-mono font-extrabold tracking-wider text-slate-900">
              1004
            </p>
          </div>
          <button
            onClick={() => handleCopy("1004", "chat-pwd")}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center space-x-1 hover:bg-slate-50 transition"
          >
            {copiedKey === "chat-pwd" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>암호 복사</span>
              </>
            )}
          </button>
        </div>

        {/* 단톡방 바로가기 버튼 */}
        <a
          href="https://open.kakao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-[#191919] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm hover:bg-black transition text-center"
        >
          <span>카카오톡 단톡방 바로 입장하기</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 🌟 2. 월 주차 시간 퀵 카드 (핵심 요구사항) */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold text-blue-950 flex items-center space-x-1.5">
              <Car className="w-4 h-4 text-blue-700" />
              <span>월 방문 차량 무료 주차 안내</span>
            </CardTitle>
            <Badge variant="default" className="text-[10px]">매월 1일 충전</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1 space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-blue-100">
            <span className="text-slate-600">세대당 기본 무료 등록</span>
            <span className="font-extrabold text-blue-950">정기차량 1대</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-blue-100">
            <span className="text-slate-600">월 방문차량 무료 지원 시간</span>
            <span className="font-extrabold text-blue-950 text-sm">월 60시간 무료</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600">초과 시 요금</span>
            <span className="font-semibold text-slate-700">10분당 500원</span>
          </div>

          <a
            href="https://parking.example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center space-x-1 hover:bg-blue-800 transition shadow-sm"
          >
            <span>방문차량 번호 등록 바로가기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </CardContent>
      </Card>

      {/* 카테고리 필터 */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition-all text-xs ${
              selectedCategory === c.id
                ? "bg-blue-900 text-white shadow-sm font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ 아코디언 목록 */}
      <div className="space-y-2.5">
        {filteredFaqs.map((item) => {
          const isOpen = Boolean(openAccordionIds[item.id]);
          return (
            <Card
              key={item.id}
              className={`border-slate-200 transition-all ${
                item.highlight ? "border-amber-300/80 bg-amber-50/20" : ""
              }`}
            >
              <div
                onClick={() => toggleAccordion(item.id)}
                className="p-3.5 flex items-start justify-between cursor-pointer select-none"
              >
                <div className="flex items-start space-x-2.5 pr-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.question}
                  </p>
                </div>
                <div className="text-slate-400 shrink-0 mt-0.5">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isOpen && (
                <div className="px-3.5 pb-3.5 pt-0 border-t border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2.5">
                  <p className="whitespace-pre-line pt-2 text-[11px] sm:text-xs">
                    {item.answer}
                  </p>

                  {/* 복사 버튼이 있는 경우 (전화번호, 계좌번호, 코드 등) */}
                  {item.copyValue && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-mono text-xs font-bold text-blue-900">
                        {item.copyValue}
                      </span>
                      <button
                        onClick={() => handleCopy(item.copyValue || "", item.id)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center space-x-1 hover:bg-slate-50"
                      >
                        {copiedKey === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">복사 완료</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>복사하기</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* 외부 링크가 있는 경우 */}
                  {item.linkUrl && (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-700 hover:underline"
                    >
                      <span>{item.linkText || "관련 페이지 바로가기"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* 관리자 단톡방 가입 인증코드 관리 모달 */}
      <Dialog open={isPasscodeModalOpen} onOpenChange={setIsPasscodeModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>단톡방 가입 인증코드 관리</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            단톡방 공지사항에 기재할 홈페이지 회원가입 인증 암호를 설정합니다.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateGroupPasscode(newPasscode);
            setIsPasscodeModalOpen(false);
            alert("단톡방 인증코드가 성공적으로 변경되었습니다.");
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              새 단톡방 가입 인증코드
            </label>
            <Input
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value.toUpperCase())}
              placeholder="예: UNIQUE2026"
              className="font-mono tracking-widest uppercase font-bold"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              * 변경 후 카카오톡 단톡방 상단 공지에도 동일한 암호를 공지해 주세요.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPasscodeModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm" className="bg-blue-900 font-bold">
              암호 변경 저장
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
