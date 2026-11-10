import type { Metadata } from "next";
import { FAQView } from "@/components/views/FAQView";

export const metadata: Metadata = {
  title: "입주민 FAQ & 생활안내 | 유니크 센트럴 오피스텔 입주민대표회의",
  description: "공식 카카오톡 단톡방 링크, 월 방문차량 무료 주차 시간, 관리사무소 및 24시간 방재실 연락처 안내",
};

export default function FAQPage() {
  return <FAQView />;
}
