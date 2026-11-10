"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Eye, ZoomIn, Image as ImageIcon, Share2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { notices } = useData();

  const notice = notices.find((n) => n.id === id);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: notice?.title || "유니크 센트럴 공지",
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("공지사항 링크가 클립보드에 복사되었습니다! 단톡방에 공유하세요.");
      }
    }
  };

  if (!notice) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">
          해당 공지사항을 찾을 수 없습니다.
        </p>
        <Link href="/notices">
          <Button size="sm" variant="outline">
            공지사항 목록으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 상단 네비게이션 액션바 */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <Link
          href="/notices"
          className="flex items-center space-x-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>목록으로</span>
        </Link>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1 text-xs font-semibold text-primary px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>단톡방 공유</span>
        </button>
      </div>

      {/* 헤더 메타정보 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          {notice.isUrgent && <Badge variant="destructive">긴급 공지</Badge>}
          {notice.category === "elevator" && <Badge variant="elevator">승강기 부착물</Badge>}
          {notice.category === "council" && <Badge variant="default">입대의 의결</Badge>}
          {notice.category === "facility" && <Badge variant="secondary">시설/점검</Badge>}
          <span className="text-xs text-muted-foreground">
            {formatDate(notice.createdAt)}
          </span>
        </div>

        <h1 className="text-lg font-bold text-card-foreground leading-snug">
          {notice.title}
        </h1>

        <div className="flex items-center space-x-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{notice.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>조회수 {notice.viewCount}</span>
          </span>
        </div>
      </div>

      {/* 엘리베이터 부착물 사진 */}
      {notice.elevatorImageUrl && (
        <div className="space-y-1.5">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
            <img
              src={notice.elevatorImageUrl}
              alt="엘리베이터 부착물 안내문"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-center">
            💡 실제 엘리베이터 게시판에 부착된 공식 안내문입니다.
          </p>
        </div>
      )}

      {/* 공지 본문 내용 */}
      <div className="p-4 bg-secondary/60 rounded-2xl border border-border text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
        {notice.content}
      </div>

      <div className="pt-4 border-t border-border">
        <Link href="/notices" className="block">
          <Button variant="outline" className="w-full text-xs">
            전체 공지사항 목록 보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
