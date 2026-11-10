import type { Metadata } from "next";
import { NoticesView } from "@/components/views/NoticesView";

export const metadata: Metadata = {
  title: "공지사항 | 유니크 센트럴 오피스텔 입주민대표회의",
  description: "승강기 부착물 및 입주민대표회의 공식 의결 공지사항",
};

export default function NoticesPage() {
  return <NoticesView />;
}
