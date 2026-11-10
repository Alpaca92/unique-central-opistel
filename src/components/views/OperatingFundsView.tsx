"use client";

import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  Plus,
  Trash2,
  Calendar,
  Filter,
  FileText,
  Building,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { OperatingFundRecord, FundCategory } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { formatCurrency, formatDate } from "@/lib/utils";

export function OperatingFundsView() {
  const {
    funds,
    currentFundBalance,
    totalIncomeThisMonth,
    totalExpenseThisMonth,
    addFundRecord,
    deleteFundRecord,
  } = useData();
  const { isAdmin } = useAuth();

  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [selectedReceipt, setSelectedReceipt] = useState<OperatingFundRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 지출/수입 폼 상태
  const [formData, setFormData] = useState({
    date: "2026-11-01",
    type: "expense" as "income" | "expense",
    category: "supplies" as FundCategory,
    title: "",
    description: "",
    amount: 0,
    payeeOrPayer: "",
    receiptImageUrl: "",
    receiptNote: "카드 영수증 확인 완료",
    createdBy: "총무 (1003호)",
  });

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split("T")[0],
    }));
  }, []);

  const filteredFunds = funds.filter((f) => {
    if (filterType === "all") return true;
    return f.type === filterType;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.amount <= 0) return;

    await addFundRecord(formData);
    setIsAddModalOpen(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "supplies",
      title: "",
      description: "",
      amount: 0,
      payeeOrPayer: "",
      receiptImageUrl: "",
      receiptNote: "카드 영수증 확인 완료",
      createdBy: "총무 (1003호)",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("이 회비 내역을 삭제하시겠습니까?")) {
      await deleteFundRecord(id);
    }
  };

  const getCategoryName = (category: FundCategory) => {
    switch (category) {
      case "meeting":
        return "회의/다과비";
      case "supplies":
        return "소모품/안내판";
      case "advisory":
        return "전문가 자문료";
      case "repair":
        return "시설 수선비";
      case "beverage":
        return "음료/격려품";
      case "bank_interest":
        return "이자수익";
      default:
        return "기타 운영비";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 상단 헤더 & 관리자 추가 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
            <Wallet className="w-5 h-5 text-blue-900" />
            <span>운영회비 사용 내역</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            입대의 전용 통장 입출금 및 영수증 실시간 공개
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold bg-blue-900 text-white rounded-xl shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>내역 작성</span>
          </Button>
        )}
      </div>

      {/* 회비 현황 요약 대시보드 카드 */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-5 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-200">
            신한은행 입대의 전용통장 잔고
          </span>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>실시간 정산 일치</span>
          </span>
        </div>

        <div>
          <p className="text-xs text-slate-400">현재 운영회비 잔액</p>
          <p className="text-3xl font-extrabold tracking-tight mt-0.5 text-white">
            {formatCurrency(currentFundBalance)}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">이번달 입금(수입)</p>
              <p className="font-bold text-xs text-emerald-300">
                +{formatCurrency(totalIncomeThisMonth)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">이번달 지출</p>
              <p className="font-bold text-xs text-red-300">
                -{formatCurrency(totalExpenseThisMonth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 탭 (전체 / 지출만 / 수입만) */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === "all" ? "bg-white text-blue-900 shadow-sm" : "text-slate-500"
            }`}
          >
            전체 ({funds.length})
          </button>
          <button
            onClick={() => setFilterType("expense")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === "expense" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"
            }`}
          >
            지출 내역
          </button>
          <button
            onClick={() => setFilterType("income")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filterType === "income" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
            }`}
          >
            수입 내역
          </button>
        </div>

        <span className="text-[11px] text-slate-400">영수증 첨부 의무화</span>
      </div>

      {/* 입출금 내역 리스트 */}
      <div className="space-y-2.5">
        {filteredFunds.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            해당 내역이 없습니다.
          </div>
        ) : (
          filteredFunds.map((item) => {
            const isExpense = item.type === "expense";
            return (
              <Card
                key={item.id}
                className="border-slate-200/90 hover:border-slate-300 transition"
              >
                <CardHeader className="p-3.5 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.date}
                      </span>
                      <Badge
                        variant={isExpense ? "secondary" : "success"}
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {getCategoryName(item.category)}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-extrabold text-sm ${
                          isExpense ? "text-slate-900" : "text-emerald-600"
                        }`}
                      >
                        {isExpense ? "-" : "+"}
                        {formatCurrency(item.amount)}
                      </span>

                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-300 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3.5 pt-0 space-y-2">
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <span>거래처: <strong className="text-slate-700">{item.payeeOrPayer}</strong></span>
                      <span>•</span>
                      <span>잔액: {formatCurrency(item.balanceAfter)}</span>
                    </div>

                    {/* 영수증 보기 버튼 */}
                    {item.receiptImageUrl ? (
                      <button
                        onClick={() => setSelectedReceipt(item)}
                        className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-900 font-bold text-[10px] hover:bg-blue-100 transition border border-blue-200"
                      >
                        <Receipt className="w-3 h-3 text-blue-600" />
                        <span>영수증 보기</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {item.receiptNote || "통장 자동기록"}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* 영수증 증빙 확인 모달 */}
      <Dialog open={Boolean(selectedReceipt)} onOpenChange={() => setSelectedReceipt(null)}>
        {selectedReceipt && (
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <Receipt className="w-4 h-4 text-blue-900" />
                <span>영수증/세금계산서 증빙 원본</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {selectedReceipt.title} ({formatCurrency(selectedReceipt.amount)})
              </DialogDescription>
            </DialogHeader>

            {selectedReceipt.receiptImageUrl ? (
              <div className="max-h-[65vh] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-1">
                <img
                  src={selectedReceipt.receiptImageUrl}
                  alt="영수증 원본"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            ) : null}

            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">결제 일자:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">결제처:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.payeeOrPayer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">증빙 비고:</span>
                <span className="font-semibold text-blue-900">{selectedReceipt.receiptNote}</span>
              </div>
            </div>

            <div className="text-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedReceipt(null)}
                className="text-xs"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* 관리자 운영회비 내역 작성 모달 */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            운영회비 사용/입금 내역 등록
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            입대의 전용 통장 및 카드 결제 내역을 투명하게 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">구분</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "income" | "expense" })
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="expense">지출 (출금)</option>
                <option value="income">수입 (입금)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as FundCategory })
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white"
              >
                <option value="supplies">소모품/안내판</option>
                <option value="meeting">회의/다과비</option>
                <option value="advisory">전문가 자문료</option>
                <option value="repair">시설 수선비</option>
                <option value="beverage">음료/격려품</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">거래 일자</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">금액 (원)</label>
              <Input
                type="number"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="예: 35000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">항목명 / 적요</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 11월 승강기 게시판 부착용 클립보드 구매"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">지급처 / 입금처</label>
            <Input
              value={formData.payeeOrPayer}
              onChange={(e) => setFormData({ ...formData, payeeOrPayer: e.target.value })}
              placeholder="예: 오피스디포 중앙점 / 관리사무소"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">영수증 이미지 URL</label>
            <Input
              value={formData.receiptImageUrl}
              onChange={(e) => setFormData({ ...formData, receiptImageUrl: e.target.value })}
              placeholder="https://... (영수증 사진 링크)"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">상세 사용 목적 및 사유</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              placeholder="입주민을 위해 해당 비용이 사용된 이유를 기록합니다."
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm" className="bg-blue-900 font-bold">
              내역 등록하기
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
