import type { Metadata } from "next";
import { OperatingFundsView } from "@/components/views/OperatingFundsView";

export const metadata: Metadata = {
  title: "운영회비 사용 내역 | 유니크 센트럴 오피스텔 입주민대표회의",
  description: "입대의 전용 법인통장 입출금 내역 및 카드 영수증·세금계산서 증빙 투명 공개",
};

export default function FundsPage() {
  return <OperatingFundsView />;
}
