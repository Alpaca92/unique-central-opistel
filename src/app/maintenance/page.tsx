import type { Metadata } from "next";
import { MaintenanceView } from "@/components/views/MaintenanceView";

export const metadata: Metadata = {
  title: "관리비 총괄표 | 유니크 센트럴 오피스텔 입주민대표회의",
  description: "매월 관리비 정산 총괄표 및 세대별 부과 공식, 관리비 계산기 안내",
};

export default function MaintenancePage() {
  return <MaintenanceView />;
}
