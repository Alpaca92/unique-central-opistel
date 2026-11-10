export type ResidentType = "owner" | "tenant";
export type UserRole = "resident" | "admin";

export interface User {
  id: string;
  kakaoId: string;
  nickname: string;
  profileImage?: string;
  building?: string; // 동 (예: 101동)
  roomNumber?: string; // 호수 (예: 1204호)
  residentType?: ResidentType; // 소유자 or 세입자(임차인)
  isVerified: boolean; // 단톡방 인증코드를 통한 입주민 인증 완료 여부
  role: UserRole; // 입주민 or 입대의 관리자
  joinedAt: string;
}

export type NoticeCategory = "elevator" | "council" | "facility" | "urgent" | "general";

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  isUrgent?: boolean;
  isPinned?: boolean;
  elevatorImageUrl?: string; // 엘리베이터 부착물 사진/포스터
  author: string;
  createdAt: string;
  viewCount: number;
}

export interface UnitPricingExplanation {
  commonFeeBasis: string; // 공용관리비 배분 기준 (예: 전용면적/계약면적 비율 배분)
  perSquareMeterRate: number; // ㎡당 기본 공용관리비 (원)
  electricCalculation: string; // 전기료 부과 방식 (세대검침량 단가 + 공용전기 배분)
  waterCalculation: string; // 수도료 부과 방식 (세대검침량 톤당 단가 + 공용수도 배분)
  longTermRepairFeeNotice: string; // 장기수선충당금 부과 원칙 (소유자 부담 원칙 및 이사 시 정산)
  heatingCalculation?: string; // 난방/온수 부과 방식
}

export interface MaintenanceBillItem {
  name: string;
  amount: number;
  description?: string;
}

export interface MaintenanceBill {
  id: string;
  yearMonth: string; // 예: "2026-10"
  title: string;
  totalAmount: number; // 총 관리비
  householdCount: number; // 부과 세대수 (예: 240세대)
  averagePerHousehold: number; // 세대당 평균
  period: string; // 부과 기간 (예: 2026.09.01 ~ 2026.09.30)
  dueDate: string; // 납부 마감일 (예: 2026.10.31)
  
  // 항목별 요약
  commonManagementFee: number; // 일반 공용관리비
  individualUsageFee: number; // 개별사용료 (전기/수도/가스 등)
  longTermRepairFund: number; // 장기수선충당금

  // 세부 항목들
  commonDetails: MaintenanceBillItem[];
  individualDetails: MaintenanceBillItem[];

  // 각 세대별 부과 방식 설명 (필수 요구사항!)
  pricingRule: UnitPricingExplanation;

  // 원본 고지서 / 총괄표 이미지 또는 PDF 링크
  originalSheetUrl?: string;
  adminNote?: string;
  createdAt: string;
}

export type FundCategory = "meeting" | "supplies" | "advisory" | "repair" | "beverage" | "bank_interest" | "other";

export interface OperatingFundRecord {
  id: string;
  date: string; // YYYY-MM-DD
  type: "income" | "expense"; // 수입 or 지출
  category: FundCategory;
  title: string;
  description: string;
  amount: number;
  balanceAfter: number; // 거래 후 잔액
  payeeOrPayer: string; // 지급처 또는 입금처
  receiptImageUrl?: string; // 영수증 증빙 사진
  receiptNote?: string;
  createdBy: string;
}

export type FAQCategory = "groupchat" | "parking" | "living" | "management";

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  highlight?: boolean;
  linkUrl?: string;
  linkText?: string;
  copyValue?: string; // 원클릭 복사할 값 (단톡방 비밀번호, 계좌번호 등)
}

export type ActiveTab = "notices" | "maintenance" | "funds" | "faq";
