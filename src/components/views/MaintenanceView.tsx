"use client";

import React, { useState } from "react";
import {
  ReceiptText,
  Calculator,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function MaintenanceView() {
  const { bills, addBill } = useData();
  const { isAdmin } = useAuth();

  const [selectedBillId, setSelectedBillId] = useState<string>(
    bills.length > 0 ? bills[0].id : ""
  );
  const [activeTabSection, setActiveTabSection] = useState<"summary" | "formula" | "details">(
    "summary"
  );
  const [myAreaInput, setMyAreaInput] = useState<number>(59.4); // 기본 59.4㎡ (약 18평)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isOriginalSheetOpen, setIsOriginalSheetOpen] = useState(false);

  // 현재 선택된 관리비 총괄 데이터
  const currentBill = bills.find((b) => b.id === selectedBillId) || bills[0];

  // 내 면적 기준 실시간 예상 기본 관리비 계산
  const estimatedCommonFee = currentBill?.pricingRule?.perSquareMeterRate
    ? Math.round(myAreaInput * currentBill.pricingRule.perSquareMeterRate)
    : 0;
  const estimatedRepairFund = Math.round(myAreaInput * 250); // ㎡당 250원

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 상단 타이틀 & 관리자 등록 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-foreground tracking-tight flex items-center space-x-1.5">
            <ReceiptText className="w-5 h-5 text-primary" />
            <span>관리비 총괄표</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            매월 관리비 정산 내역 및 세대별 부과 공식 안내
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>총괄표 등록</span>
          </Button>
        )}
      </div>

      {/* 월 선택 셀렉터 */}
      {bills.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {bills.map((bill) => (
            <button
              key={bill.id}
              onClick={() => setSelectedBillId(bill.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                (currentBill?.id === bill.id)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {bill.yearMonth}분 총괄표
            </button>
          ))}
        </div>
      )}

      {currentBill ? (
        <div className="space-y-4">
          {/* 주요 요약 카드 */}
          <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-slate-900 p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-blue-100">
                {currentBill.yearMonth}월 정산
              </span>
              <span className="text-xs text-blue-200">
                총 {currentBill.householdCount}세대 부과
              </span>
            </div>

            <div>
              <p className="text-xs text-blue-200/80">단지 전체 부과 총액</p>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
                {formatCurrency(currentBill.totalAmount)}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-blue-200/70 text-[11px]">세대당 평균 부과액</p>
                <p className="font-bold text-sm text-white mt-0.5">
                  약 {formatCurrency(currentBill.averagePerHousehold)}
                </p>
              </div>
              <div>
                <p className="text-blue-200/70 text-[11px]">납부 마감일</p>
                <p className="font-bold text-sm text-amber-300 mt-0.5">
                  {currentBill.dueDate}까지
                </p>
              </div>
            </div>

            {/* 원본 총괄표 열람 버튼 */}
            {currentBill.originalSheetUrl && (
              <button
                onClick={() => setIsOriginalSheetOpen(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs font-semibold text-center flex items-center justify-center space-x-1.5 border border-white/15"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-300" />
                <span>관리비 총괄표 원본 문서 열람</span>
              </button>
            )}
          </div>

          {/* 서브 탭: 요약 / 세대별 부과 공식 / 세부 내역 */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-secondary rounded-xl text-xs font-bold text-center">
            <button
              onClick={() => setActiveTabSection("summary")}
              className={`py-2 rounded-lg transition ${
                activeTabSection === "summary"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              부과 구성
            </button>
            <button
              onClick={() => setActiveTabSection("formula")}
              className={`py-2 rounded-lg transition ${
                activeTabSection === "formula"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📐 부과 방식·공식
            </button>
            <button
              onClick={() => setActiveTabSection("details")}
              className={`py-2 rounded-lg transition ${
                activeTabSection === "details"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              상세 항목
            </button>
          </div>

          {/* 1. 부과 구성 요약 탭 */}
          {activeTabSection === "summary" && (
            <div className="space-y-3">
              <Card className="border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold text-card-foreground">
                    항목별 부과 비중
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3 text-xs">
                  {/* 일반공용관리비 */}
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">일반 공용관리비 (청소/경비/소독 등)</span>
                      <span className="font-bold text-card-foreground">
                        {formatCurrency(currentBill.commonManagementFee)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{
                          width: `${(currentBill.commonManagementFee / currentBill.totalAmount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 세대개별사용료 */}
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">개별 사용료 (전기/수도/폐기물 등)</span>
                      <span className="font-bold text-card-foreground">
                        {formatCurrency(currentBill.individualUsageFee)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{
                          width: `${(currentBill.individualUsageFee / currentBill.totalAmount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* 장기수선충당금 */}
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-foreground">장기수선충당금 (법정 적립)</span>
                      <span className="font-bold text-card-foreground">
                        {formatCurrency(currentBill.longTermRepairFund)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{
                          width: `${(currentBill.longTermRepairFund / currentBill.totalAmount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 관리자 비고 / 분석 코멘트 */}
              {currentBill.adminNote && (
                <div className="p-3.5 bg-primary/5 border border-primary/10 rounded-2xl text-xs text-foreground space-y-1">
                  <div className="font-bold flex items-center space-x-1 text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>입대의 총평 및 변동 요인</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {currentBill.adminNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. 각 세대에 어떻게 부과되는지 부과 방식 표기 */}
          {activeTabSection === "formula" && (
            <div className="space-y-3.5">
              {/* 핵심 안내 배너 */}
              <div className="p-3.5 bg-card text-foreground border border-border rounded-2xl space-y-1 text-xs">
                <div className="font-bold text-primary flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>우리 세대 관리비는 어떻게 산출되나요?</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  집합건물법 및 유니크 센트럴 오피스텔 관리규약에 따른 투명한 세대별 부과 공식입니다.
                </p>
              </div>

              {/* 내 면적 기준 실시간 계산 위젯 */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span>우리 집 계약면적별 기본 부과액 계산기</span>
                    <Badge variant="default" className="text-[10px]">자동 계산</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-muted-foreground font-semibold mb-1">
                      세대 계약면적(공급면적+공용지분) 입력 (㎡)
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={myAreaInput}
                        onChange={(e) => setMyAreaInput(Number(e.target.value) || 0)}
                        className="bg-card font-bold text-card-foreground h-9"
                      />
                      <span className="text-foreground font-bold shrink-0">㎡</span>
                    </div>
                    {/* 일반 평형 바로선택 칩 */}
                    <div className="flex space-x-1.5 mt-2">
                      {[42.5, 59.4, 74.2, 84.8].map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setMyAreaInput(area)}
                          className="px-2 py-0.5 rounded bg-card border border-border text-[10px] font-medium text-foreground hover:border-primary"
                        >
                          {area}㎡
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 계산 결과 카드 */}
                  <div className="p-3 bg-card rounded-xl border border-border space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">공용관리비 (㎡당 {currentBill.pricingRule.perSquareMeterRate}원)</span>
                      <span className="font-bold text-card-foreground">{formatCurrency(estimatedCommonFee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">장기수선충당금 (㎡당 250원)</span>
                      <span className="font-bold text-card-foreground">{formatCurrency(estimatedRepairFund)}</span>
                    </div>
                    <div className="pt-1.5 border-t border-border flex justify-between items-center font-bold text-xs text-primary">
                      <span>고정 기본 관리비 합계</span>
                      <span className="text-sm font-extrabold text-primary">
                        {formatCurrency(estimatedCommonFee + estimatedRepairFund)}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground pt-1">
                      * 개별 전기/수도 사용료는 세대별 원격검침 사용량에 따라 추가 합산됩니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 4대 부과 방식 상세 카드 */}
              <div className="space-y-2.5 text-xs">
                {/* 1) 공용관리비 */}
                <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">1</div>
                    <span>일반 공용관리비 부과 방식</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary border border-border font-mono text-[11px] text-primary font-bold">
                    세대 부과액 = 세대 계약면적(㎡) × {formatNumber(currentBill.pricingRule.perSquareMeterRate)}원
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {currentBill.pricingRule.commonFeeBasis}. 경비비, 청소위생비, 승강기유지비, 소방관리 등 단지 전체에 소요된 비용을 면적 비율에 따라 공평하게 배분합니다.
                  </p>
                </div>

                {/* 2) 세대 전기료 */}
                <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-foreground">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] flex items-center justify-center font-bold">2</div>
                    <span>세대 전기료 부과 방식</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary border border-border font-mono text-[11px] text-emerald-700 font-bold">
                    세대 전기료 = (세대 검침량 × 한전 누진단가) + 공용전기 배분액
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {currentBill.pricingRule.electricCalculation}
                  </p>
                </div>

                {/* 3) 세대 수도료 */}
                <div className="p-3.5 rounded-2xl bg-card border border-border shadow-sm space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-foreground">
                    <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] flex items-center justify-center font-bold">3</div>
                    <span>세대 수도료 부과 방식</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {currentBill.pricingRule.waterCalculation}
                  </p>
                </div>

                {/* 4) 장기수선충당금 */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 shadow-sm space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>장기수선충당금 (임차인 필독)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {currentBill.pricingRule.longTermRepairFeeNotice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. 세부 항목 탭 */}
          {activeTabSection === "details" && (
            <div className="space-y-3">
              <Card className="border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-bold text-card-foreground">
                    일반 공용관리비 세부 내역
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2 text-xs">
                  {currentBill.commonDetails.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-card-foreground">{item.name}</p>
                        {item.description && (
                          <p className="text-[10px] text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <span className="font-bold text-card-foreground">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-bold text-card-foreground">
                    개별 사용료 세부 내역
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-2 text-xs">
                  {currentBill.individualDetails.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-card-foreground">{item.name}</p>
                        {item.description && (
                          <p className="text-[10px] text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <span className="font-bold text-card-foreground">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-secondary/40 rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
          등록된 관리비 총괄 내역이 없습니다.
        </div>
      )}

      {/* 관리비 원본 총괄표 뷰어 모달 */}
      <Dialog open={isOriginalSheetOpen} onOpenChange={setIsOriginalSheetOpen}>
        {currentBill?.originalSheetUrl && (
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-card-foreground flex items-center space-x-1.5">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                <span>{currentBill.title} (원본 문서)</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                관리사무소에서 발행한 관리비 정산 총괄표 원본 문서입니다.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] overflow-auto rounded-xl border border-border">
              <img
                src={currentBill.originalSheetUrl}
                alt="관리비 총괄표 원본"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOriginalSheetOpen(false)}
                className="text-xs"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* 관리자 관리비 총괄표 등록 모달 */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-card-foreground">
            관리비 총괄표 신규 등록
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            새로운 월의 관리비 정산 총괄표 및 부과 방식을 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const ym = (form.elements.namedItem("yearMonth") as HTMLInputElement).value;
            const total = Number((form.elements.namedItem("totalAmount") as HTMLInputElement).value);
            const rate = Number((form.elements.namedItem("perSquareMeterRate") as HTMLInputElement).value);
            const note = (form.elements.namedItem("adminNote") as HTMLTextAreaElement).value;

            await addBill({
              yearMonth: ym,
              title: `${ym.split("-")[0]}년 ${Number(ym.split("-")[1])}월분 관리비 총괄표`,
              totalAmount: total,
              householdCount: 240,
              averagePerHousehold: Math.round(total / 240),
              period: `${ym}.01 ~ ${ym}.31`,
              dueDate: `${ym}.30`,
              commonManagementFee: Math.round(total * 0.55),
              individualUsageFee: Math.round(total * 0.38),
              longTermRepairFund: Math.round(total * 0.07),
              commonDetails: [
                { name: "일반관리비", amount: Math.round(total * 0.3) },
                { name: "경비보안비", amount: Math.round(total * 0.12) },
                { name: "청소환경비", amount: Math.round(total * 0.08) },
                { name: "승강기 유지보수비", amount: Math.round(total * 0.05) },
              ],
              individualDetails: [
                { name: "세대 전기료", amount: Math.round(total * 0.22) },
                { name: "세대 수도료", amount: Math.round(total * 0.1) },
                { name: "음식물/폐기물 처리비", amount: Math.round(total * 0.06) },
              ],
              pricingRule: {
                commonFeeBasis: "세대별 계약면적 비례 배분 방식",
                perSquareMeterRate: rate || 1450,
                electricCalculation: "기본요금 + 세대검침량 누진단가 + 공용전기 배분",
                waterCalculation: "세대검침량 단가 + 공용수도 배분",
                longTermRepairFeeNotice: "㎡당 250원 정액 부과 (소유자 법정 부담금, 임차인 퇴거 시 정산)",
              },
              adminNote: note,
              originalSheetUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
            });
            setIsUploadModalOpen(false);
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="block font-bold text-foreground mb-1">정산 연월 (YYYY-MM)</label>
            <Input name="yearMonth" type="month" defaultValue="2026-11" required />
          </div>
          <div>
            <label className="block font-bold text-foreground mb-1">단지 총 부과액 (원)</label>
            <Input name="totalAmount" type="number" defaultValue="39200000" required />
          </div>
          <div>
            <label className="block font-bold text-foreground mb-1">㎡당 공용관리비 단가 (원)</label>
            <Input name="perSquareMeterRate" type="number" defaultValue="1480" required />
          </div>
          <div>
            <label className="block font-bold text-foreground mb-1">입대의 분석 및 비고 코멘트</label>
            <textarea
              name="adminNote"
              rows={3}
              className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs"
              placeholder="예: 11월 난방배관 점검 비용 발생으로 전월 대비 소폭 상승..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm" className="font-bold">
              총괄표 등록 완료
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
