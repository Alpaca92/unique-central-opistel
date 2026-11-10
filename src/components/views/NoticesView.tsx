"use client";

import React, { useState } from "react";
import {
  Megaphone,
  Pin,
  AlertTriangle,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Eye,
  Calendar,
  User,
  Search,
  ExternalLink,
  ZoomIn,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Notice, NoticeCategory } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { formatDate } from "@/lib/utils";

export function NoticesView() {
  const { notices, addNotice, updateNotice, deleteNotice, incrementNoticeView } = useData();
  const { isAdmin } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [imageViewerUrl, setImageViewerUrl] = useState<string | null>(null);

  // 관리자 작성 모달 상태
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "elevator" as NoticeCategory,
    isUrgent: false,
    isPinned: false,
    elevatorImageUrl: "",
    author: "입주민대표회의",
  });

  const categories = [
    { id: "all", label: "전체" },
    { id: "elevator", label: "🛗 엘리베이터 부착물" },
    { id: "council", label: "🏛️ 입대의 의결" },
    { id: "urgent", label: "🚨 긴급" },
    { id: "facility", label: "🔧 시설/점검" },
  ];

  const filteredNotices = notices
    .filter((n) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "urgent") return n.isUrgent || n.category === "urgent";
      return n.category === selectedCategory;
    })
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleOpenNotice = (notice: Notice) => {
    incrementNoticeView(notice.id);
    setSelectedNotice(notice);
  };

  const handleOpenWrite = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        category: notice.category,
        isUrgent: Boolean(notice.isUrgent),
        isPinned: Boolean(notice.isPinned),
        elevatorImageUrl: notice.elevatorImageUrl || "",
        author: notice.author,
      });
    } else {
      setEditingNotice(null);
      setFormData({
        title: "",
        content: "",
        category: "elevator",
        isUrgent: false,
        isPinned: false,
        elevatorImageUrl: "",
        author: "입주민대표회의",
      });
    }
    setIsWriteModalOpen(true);
  };

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingNotice) {
      await updateNotice(editingNotice.id, formData);
    } else {
      await addNotice(formData);
    }
    setIsWriteModalOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("이 공지사항을 삭제하시겠습니까?")) {
      await deleteNotice(id);
      if (selectedNotice?.id === id) {
        setSelectedNotice(null);
      }
    }
  };

  const getCategoryBadge = (category: NoticeCategory, isUrgent?: boolean) => {
    if (isUrgent || category === "urgent") {
      return <Badge variant="destructive">긴급 공지</Badge>;
    }
    switch (category) {
      case "elevator":
        return <Badge variant="elevator">승강기 부착물</Badge>;
      case "council":
        return <Badge variant="default">입대의 의결</Badge>;
      case "facility":
        return <Badge variant="secondary">시설/점검</Badge>;
      default:
        return <Badge variant="outline">일반</Badge>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* 상단 소개 및 관리자 글쓰기 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-1.5">
            <Megaphone className="w-5 h-5 text-blue-900" />
            <span>입주민 공지사항</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            승강기 부착 안내문 및 입대의 주요 의결 공지
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            onClick={() => handleOpenWrite()}
            className="text-xs font-bold bg-blue-900 text-white rounded-xl shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>공지 등록</span>
          </Button>
        )}
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <Input
          placeholder="공지사항 제목 또는 내용 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-xs bg-slate-50/80 border-slate-200"
        />
      </div>

      {/* 카테고리 칩 필터 */}
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

      {/* 공지사항 목록 */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            등록된 공지사항이 없습니다.
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <Card
              key={notice.id}
              onClick={() => handleOpenNotice(notice)}
              className="cursor-pointer hover:border-blue-400 hover:shadow-md transition-all active:scale-[0.99] border-slate-200/90"
            >
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {notice.isPinned && (
                      <span className="flex items-center text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                        <Pin className="w-2.5 h-2.5 mr-0.5 fill-current" />
                        고정
                      </span>
                    )}
                    {getCategoryBadge(notice.category, notice.isUrgent)}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenWrite(notice);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(notice.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <CardTitle className="text-sm font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">
                  {notice.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3.5 pt-0">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notice.content}
                </p>

                {/* 엘리베이터 부착물 이미지 썸네일 미리보기 */}
                {notice.elevatorImageUrl && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageViewerUrl(notice.elevatorImageUrl || null);
                    }}
                    className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-[11px] font-semibold text-slate-700">
                        엘리베이터 부착물 원본 사진 첨부
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-700 font-bold flex items-center space-x-0.5">
                      <ZoomIn className="w-3 h-3" />
                      <span>확대보기</span>
                    </span>
                  </div>
                )}

                {/* 하단 메타정보 */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{notice.author}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(notice.createdAt)}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{notice.viewCount}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 공지 상세 보기 모달 */}
      <Dialog open={Boolean(selectedNotice)} onOpenChange={() => setSelectedNotice(null)}>
        {selectedNotice && (
          <div>
            <DialogHeader>
              <div className="flex items-center space-x-2 mb-2">
                {getCategoryBadge(selectedNotice.category, selectedNotice.isUrgent)}
                <span className="text-xs text-slate-400">
                  {formatDate(selectedNotice.createdAt)}
                </span>
              </div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {selectedNotice.title}
              </DialogTitle>
              <div className="text-xs text-slate-500 flex items-center space-x-3 pt-1">
                <span>작성자: {selectedNotice.author}</span>
                <span>조회수: {selectedNotice.viewCount}</span>
              </div>
            </DialogHeader>

            {/* 승강기 부착물 원본 이미지 */}
            {selectedNotice.elevatorImageUrl && (
              <div className="my-3 space-y-1.5">
                <div
                  onClick={() => setImageViewerUrl(selectedNotice.elevatorImageUrl || null)}
                  className="relative rounded-xl overflow-hidden border border-slate-200 group cursor-pointer"
                >
                  <img
                    src={selectedNotice.elevatorImageUrl}
                    alt="엘리베이터 부착물 안내문"
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold space-x-1">
                    <ZoomIn className="w-4 h-4" />
                    <span>부착물 원본 확대보기</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  💡 엘리베이터 내부에 부착된 공식 안내문 사진입니다. (터치 시 확대)
                </p>
              </div>
            )}

            {/* 본문 내용 */}
            <div className="mt-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
              {selectedNotice.content}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNotice(null)}
                className="text-xs"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* 부착물 사진 전체화면 확대 모달 */}
      <Dialog open={Boolean(imageViewerUrl)} onOpenChange={() => setImageViewerUrl(null)}>
        {imageViewerUrl && (
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-blue-900" />
                <span>엘리베이터 부착물 원본 사진</span>
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200">
              <img
                src={imageViewerUrl}
                alt="공지 원본"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="text-right">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setImageViewerUrl(null)}
                className="text-xs"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* 관리자 공지 작성 / 수정 모달 */}
      <Dialog open={isWriteModalOpen} onOpenChange={setIsWriteModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {editingNotice ? "공지사항 수정" : "새 공지사항 등록"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            엘리베이터 부착물 또는 입대의 의결 공지를 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitNotice} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">카테고리</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as NoticeCategory })
              }
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs"
            >
              <option value="elevator">🛗 승강기 부착물 안내</option>
              <option value="council">🏛️ 입대의 정기/임시 의결</option>
              <option value="facility">🔧 시설 점검 및 유지보수</option>
              <option value="urgent">🚨 긴급 안내</option>
              <option value="general">일반 공지</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">제목</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: [공지] 11월 승강기 정기 점검 안내"
              required
            />
          </div>

          <div className="flex items-center space-x-4 py-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span className="font-semibold text-red-600">긴급 공지 표시</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700">상단 고정 (핀)</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              엘리베이터 부착물 사진 URL (선택)
            </label>
            <Input
              value={formData.elevatorImageUrl}
              onChange={(e) => setFormData({ ...formData, elevatorImageUrl: e.target.value })}
              placeholder="https://... (안내문 사진 링크)"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">공지 본문 내용</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="공지할 내용을 상세히 작성해 주세요..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsWriteModalOpen(false)}
            >
              취소
            </Button>
            <Button type="submit" size="sm" className="bg-blue-900 font-bold">
              {editingNotice ? "수정 완료" : "공지 등록하기"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
