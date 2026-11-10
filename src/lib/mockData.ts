import { Notice, MaintenanceBill, OperatingFundRecord, FAQItem, User } from "@/types";

// 기본 단톡방 인증 암호 (단톡방 공지사항에 기재되는 시크릿 코드)
export const DEFAULT_GROUP_PASSCODE = "UNIQUE2026";

// 기본 관리자 계정 정보 (데모 및 테스트용)
export const DEFAULT_ADMIN_USER: User = {
  id: "admin-1",
  kakaoId: "kakao-admin-unique",
  nickname: "입대의 회장 (1204호)",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  building: "101동",
  roomNumber: "1204호",
  residentType: "owner",
  isVerified: true,
  role: "admin",
  joinedAt: "2026-01-15",
};

// 기본 입주민 계정 정보
export const DEFAULT_RESIDENT_USER: User = {
  id: "resident-1",
  kakaoId: "kakao-resident-702",
  nickname: "김유니크 (702호)",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  building: "101동",
  roomNumber: "702호",
  residentType: "owner",
  isVerified: true,
  role: "resident",
  joinedAt: "2026-03-20",
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "[공지] 11월 2,3호기 승강기 정기 안전점검 및 부품 교체 안내",
    content: `입주민 여러분 안녕하십니까, 유니크 센트럴 오피스텔 입주민대표회의입니다.

승강기안전관리법 제32조에 의거하여 승강기 노후 권상기 와이어로프 및 도어 개폐 장치 교체 작업이 진행될 예정입니다.

■ 점검 및 공사 일시: 2026년 11월 18일(수) 10:00 ~ 16:00 (약 6시간 소요 예정)
■ 대상 승강기: 101동 2호기, 3호기 (교번 작업 진행)
  - 10:00 ~ 13:00 : 2호기 운행 정지 (1, 3, 4호기 정상 운행)
  - 13:00 ~ 16:00 : 3호기 운행 정지 (1, 2, 4호기 정상 운행)
■ 당부 말씀:
작업 시간 동안 승강기 대기 시간이 평소보다 다소 길어질 수 있으니 입주민 여러분의 너그러운 양해 부탁드립니다.
엘리베이터 게시판에도 동일한 안내문이 부착되어 있으니 참고하시기 바랍니다.`,
    category: "elevator",
    isUrgent: false,
    isPinned: true,
    elevatorImageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80",
    author: "입주민대표회의",
    createdAt: "2026-11-08",
    viewCount: 342,
  },
  {
    id: "notice-2",
    title: "[긴급] 지하 2층~3층 주차장 고압 물청소에 따른 차량 이동 주차 요청",
    content: `지하주차장 분진 및 오염물질 제거를 위한 하반기 정기 고압 물청소를 실시합니다.
작업 중 오염수 비산 및 안전사고 방지를 위해 해당 구역 차량은 지정된 일시에 지상 또는 지하 1층으로 이동 주차하여 주시기 바랍니다.

■ 작업 일정:
- 지하 2층: 2026년 11월 14일(토) 09:00 ~ 18:00
- 지하 3층: 2026년 11월 15일(일) 09:00 ~ 18:00

※ 이동하지 않은 차량에 대해서는 개별 유선 연락을 드리며, 미이동으로 인한 세차비 지원 등은 불가하오니 필히 협조 부탁드립니다.`,
    category: "urgent",
    isUrgent: true,
    isPinned: true,
    elevatorImageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80",
    author: "관리사무소 / 입대의",
    createdAt: "2026-11-06",
    viewCount: 512,
  },
  {
    id: "notice-3",
    title: "[입대의 의결] 2026년 3분기 정기 입주민대표회의 의결 결과 공고",
    content: `2026년 10월 28일 개최된 제14회 정기 입주민대표회의 의결 사항을 공고합니다.

1. 안건 1호: 지하주차장 사각지대 CCTV 8대 고화질 교체 및 신설 건
   - 결과: 찬성 5표, 반대 0표 (원안 가결, 장기수선충당금 집행 승인)
2. 안건 2호: 피트니스 센터 노후 런닝머신 인버터 수리 건
   - 결과: 찬성 5표, 반대 0표 (가결, 운영비 수선유지비 집행)
3. 안건 3호: 입주민 공식 카카오톡 단톡방 운영 및 본 안내페이지 개설 승인
   - 결과: 찬성 5표, 반대 0표 (투명한 관리비 및 운영회비 공개 목적 가결)

자세한 회의록 원본은 관리사무소에서 열람 가능합니다.`,
    category: "council",
    isUrgent: false,
    isPinned: false,
    author: "입주민대표회의",
    createdAt: "2026-10-30",
    viewCount: 289,
  },
  {
    id: "notice-4",
    title: "[공지] 동절기 세대 보일러 동파 방지 요령 및 계량기 보온 안내",
    content: `기온 급강하에 대비하여 세대 내 보일러 및 수도계량기 동파 사고를 예방하고자 안내드립니다.

1. 보일러 외출 모드 설정: 장기 외출 시 보일러 전원을 끄지 마시고 '외출(최소 10도 이상)'로 설정하십시오.
2. 실외기실 및 보일러실 루버창 닫힘 확인: 찬바람이 직접 유입되지 않도록 창틀을 닫아주십시오.
3. 세탁기 급수/배수 호스 물 빼기: 한파 특보 발령 시 베란다 세탁기 사용을 자제해 주십시오.`,
    category: "facility",
    isUrgent: false,
    isPinned: false,
    elevatorImageUrl: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&auto=format&fit=crop&q=80",
    author: "관리사무소",
    createdAt: "2026-10-22",
    viewCount: 198,
  },
];

export const INITIAL_MAINTENANCE_BILLS: MaintenanceBill[] = [
  {
    id: "bill-2026-10",
    yearMonth: "2026-10",
    title: "2026년 10월분 관리비 총괄표",
    totalAmount: 38450000,
    householdCount: 240,
    averagePerHousehold: 160200,
    period: "2026.10.01 ~ 2026.10.31",
    dueDate: "2026.11.30",
    commonManagementFee: 21500000,
    individualUsageFee: 14250000,
    longTermRepairFund: 2700000,
    commonDetails: [
      { name: "일반관리비 (인건비/복리후생/사무비)", amount: 11200000, description: "관리소장, 경비, 미화직원 인건비 및 피복/식대" },
      { name: "경비/보안 도급비", amount: 4300000, description: "24시간 방재 및 야간 순찰 보안 위탁" },
      { name: "청소/환경위생 관리비", amount: 2800000, description: "공용 복도, 계단, 승강기 청소 및 소독" },
      { name: "승강기 유지보수비", amount: 1200000, description: "현대엘리베이터 정기 점검 4대분" },
      { name: "소방/전기안전관리 대행료", amount: 900000, description: "법정 안전관리자 선임 위탁" },
      { name: "공용시설 화재보험료", amount: 1100000, description: "건물 및 가재도구 단체 화재보험" },
    ],
    individualDetails: [
      { name: "세대 전기료 (개별사용 + 공용전기 배분)", amount: 8400000, description: "세대별 디지털 계량기 검침분 + 로비/승강기 공용전기" },
      { name: "세대 수도료 (개별사용 + 공용수도 배분)", amount: 3950000, description: "세대별 급수 사용량 + 화단/청소 공용수도" },
      { name: "음식물쓰레기/생활폐기물 처리비", amount: 1900000, description: "RFID 종량기 종량 수수료 및 폐기물 수거" },
    ],
    pricingRule: {
      commonFeeBasis: "세대별 계약면적(공급면적+공용지분) 비례 배분 방식",
      perSquareMeterRate: 1450, // ㎡당 1,450원
      electricCalculation: "기본요금(한전 규정) + 세대 검침량(kWh당 누진요율) + 공용전기 균등배분(세대당 약 12,500원)",
      waterCalculation: "세대 검침량(톤당 980원) + 하수도원인자부담금 + 공용수도 배분(세대당 약 2,800원)",
      longTermRepairFeeNotice: "㎡당 250원 정액 부과. [중요] 장기수선충당금은 주택법상 '소유자(임대인)'가 부담해야 하는 항목입니다. 임차인은 이사(퇴거) 시 관리사무소에서 납부확인서를 발급받아 임대인에게 전액 환급 청구하시기 바랍니다.",
      heatingCalculation: "개별 도시가스 사용 (삼천리 도시가스 개별 고지서 발송, 관리비 비포함)",
    },
    originalSheetUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
    adminNote: "10월은 냉방 수요 감소로 세대 전기요금이 9월 대비 평균 18% 감소하였습니다.",
    createdAt: "2026-11-05",
  },
  {
    id: "bill-2026-09",
    yearMonth: "2026-09",
    title: "2026년 9월분 관리비 총괄표",
    totalAmount: 42100000,
    householdCount: 240,
    averagePerHousehold: 175400,
    period: "2026.09.01 ~ 2026.09.30",
    dueDate: "2026.10.31",
    commonManagementFee: 21300000,
    individualUsageFee: 18100000,
    longTermRepairFund: 2700000,
    commonDetails: [
      { name: "일반관리비", amount: 11100000 },
      { name: "경비/보안비", amount: 4300000 },
      { name: "청소위생관리비", amount: 2800000 },
      { name: "승강기 유지보수비", amount: 1200000 },
      { name: "기타 공용유지비", amount: 1900000 },
    ],
    individualDetails: [
      { name: "세대 전기료 (에어컨 가동 증가)", amount: 12100000 },
      { name: "세대 수도료", amount: 4100000 },
      { name: "폐기물 수거료", amount: 1900000 },
    ],
    pricingRule: {
      commonFeeBasis: "세대별 계약면적 비례 배분",
      perSquareMeterRate: 1450,
      electricCalculation: "세대 검침량 + 공용전기 배분",
      waterCalculation: "세대 검침량 + 공용수도 배분",
      longTermRepairFeeNotice: "㎡당 250원 정액 부과 (소유자 부담)",
    },
    originalSheetUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80",
    createdAt: "2026-10-06",
  },
];

export const INITIAL_OPERATING_FUNDS: OperatingFundRecord[] = [
  {
    id: "fund-6",
    date: "2026-11-04",
    type: "expense",
    category: "supplies",
    title: "승강기 게시판 안내용 아크릴 클립보드 및 자석홀더 교체",
    description: "엘리베이터 1~4호기 내부 노후 아크릴 게시판 4개 전면 교체 (오피스디포 구매)",
    amount: 48000,
    balanceAfter: 4850200,
    payeeOrPayer: "오피스디포 중앙점",
    receiptImageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=80",
    receiptNote: "카드 영수증 증빙 확인 완료",
    createdBy: "총무 (1003호)",
  },
  {
    id: "fund-5",
    date: "2026-10-28",
    type: "expense",
    category: "meeting",
    title: "3분기 정기 입주민대표회의 다과 및 회의자료 인쇄비",
    description: "동대표 5인 참석 정기회의 다과(커피, 샌드위치) 및 회의안건 인쇄",
    amount: 38500,
    balanceAfter: 4898200,
    payeeOrPayer: "파리바게뜨 중앙역점",
    receiptImageUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80",
    receiptNote: "법인체크카드 결제 영수증",
    createdBy: "총무 (1003호)",
  },
  {
    id: "fund-4",
    date: "2026-10-20",
    type: "expense",
    category: "advisory",
    title: "오피스텔 관리규약 표준안 개정 관련 법무사 자문료",
    description: "집합건물법 개정에 따른 유니크 센트럴 오피스텔 규약안 조항 검토 자문료",
    amount: 220000,
    balanceAfter: 4936700,
    payeeOrPayer: "법무사 김상훈 사무소",
    receiptImageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
    receiptNote: "전자세금계산서 발행 완료",
    createdBy: "회장 (1204호)",
  },
  {
    id: "fund-3",
    date: "2026-10-05",
    type: "income",
    category: "other",
    title: "10월분 입대의 운영비 관리비 정산금 입금",
    description: "관리규약 제45조에 따른 입주자대표회의 월간 법정 운영비 (세대당 1,500원)",
    amount: 360000,
    balanceAfter: 5156700,
    payeeOrPayer: "유니크센트럴 관리사무소",
    receiptNote: "통장 계좌이체 내역서 확인",
    createdBy: "시스템 자동처리",
  },
  {
    id: "fund-2",
    date: "2026-09-25",
    type: "expense",
    category: "supplies",
    title: "추석 명절 경비/미화원 노고 격려 선물세트 구입",
    description: "단지 쾌적한 환경 조성을 위해 수고하시는 경비원 4인, 미화원 2인 격려품 (과일 및 다과)",
    amount: 180000,
    balanceAfter: 4796700,
    payeeOrPayer: "이마트 에브리데이",
    receiptImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
    receiptNote: "체크카드 영수증 첨부",
    createdBy: "회장 (1204호)",
  },
  {
    id: "fund-1",
    date: "2026-09-01",
    type: "income",
    category: "other",
    title: "2026년 3분기 운영회비 전기 이월금",
    description: "8월말 결산 잔액 정산 이월",
    amount: 4616700,
    balanceAfter: 4976700,
    payeeOrPayer: "전기 이월",
    receiptNote: "신한은행 입대의 전용통장 잔고증명",
    createdBy: "총무 (1003호)",
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: "faq-groupchat-1",
    category: "groupchat",
    question: "공식 입주민 카카오톡 단톡방(오픈채팅방) 링크 및 참여 방법이 궁금해요.",
    answer: "유니크 센트럴 오피스텔 입주민 공식 오픈채팅방입니다. 실시간 공지 전달 및 긴급 소통을 위해 운영됩니다.\n\n※ 참여 비밀번호(참여코드)가 설정되어 있으니 아래 비밀번호를 복사 후 입장해 주세요.\n※ 닉네임 설정 규칙: [동-호수 / 이름] 예: 101-1204 홍길동",
    highlight: true,
    linkUrl: "https://open.kakao.com/o/gUniqueCentral",
    linkText: "카카오톡 단톡방 바로 입장하기",
    copyValue: "1004", // 단톡방 입장 코드
  },
  {
    id: "faq-groupchat-2",
    category: "groupchat",
    question: "홈페이지 회원가입 시 '단톡방 인증코드'는 무엇인가요?",
    answer: "본 웹사이트는 우리 오피스텔 단톡방에 참여 중인 실제 입주민분들만 열람할 수 있도록 보안 암호가 설정되어 있습니다. 카카오톡 단톡방 상단 공지사항에 기재되어 있는 가입 인증코드(기본: UNIQUE2026)를 입력하시면 즉시 정회원으로 승인됩니다.",
    highlight: true,
    copyValue: "UNIQUE2026",
  },
  {
    id: "faq-parking-1",
    category: "parking",
    question: "월 무료 방문 주차 시간은 몇 시간이고 어떻게 등록하나요?",
    answer: "세대당 매월 1일 무료 방문주차 60시간이 자동으로 충전됩니다.\n\n1. 등록 방법: '유니크 주차 웹사이트' 접속 → 동/호수 및 비밀번호 입력 → 방문차량 번호 4자리 입력 후 시간 지정.\n2. 잔여 시간 확인: 웹사이트에서 실시간 확인 가능하며, 미사용 시간은 익월로 이월되지 않습니다.\n3. 초과 요금: 60시간 초과 시 10분당 500원 부과 (출차 시 무인정산기 결제).",
    highlight: true,
    linkUrl: "https://parking.unique-central.example.com",
    linkText: "방문차량 주차 등록 바로가기",
  },
  {
    id: "faq-parking-2",
    category: "parking",
    question: "입주민 정기차량 추가 등록 기준 및 비용은 어떻게 되나요?",
    answer: "1세대당 1대는 무료 등록됩니다. 2번째 차량부터는 주차면 수 확보를 위해 추가 주차료가 부과됩니다.\n- 2번째 차량: 월 50,000원\n- 3번째 차량: 월 120,000원 (만차 시 대기 등록 필요)\n신청 서류: 자동차등록증 사본, 입주민 확인서류(관리사무소 제출).",
  },
  {
    id: "faq-management-1",
    category: "management",
    question: "관리사무소 위치, 운영시간 및 24시간 긴급 연락처는 어디인가요?",
    answer: "■ 관리사무소: 지하 1층 로비 옆 (평일 09:00 ~ 18:00, 점심시간 12:00 ~ 13:00 / 토, 일, 공휴일 휴무)\n- 직통 전화: 02-555-8270\n\n■ 24시간 방재실/경비실: 02-555-8271 (누수, 정전, 승강기 갇힘 등 야간 긴급 출동)\n■ 승강기 비상 호출: 승강기 내 비상벨 누름 또는 1577-0114(현대엘리베이터)",
    copyValue: "02-555-8270",
  },
  {
    id: "faq-living-1",
    category: "living",
    question: "쓰레기 및 재활용 분리수거 배출 장소와 시간은 언제인가요?",
    answer: "■ 분리수거장 위치: 지하 1층 주차장 출입구 우측 분리수거장 (24시간 상시 이용 가능)\n■ 일반 쓰레기: 종량제 규격 봉투(관할구청용)에 담아 일반쓰레기 수거함에 투입\n■ 음식물 쓰레기: RFID 종량기기에 세대별 등록 카드 태그 후 배출\n■ 대형 폐기물: 관할 구청 홈페이지에서 스티커 발부 후 부착하여 배출 (미부착 시 수거 불가)",
  },
  {
    id: "faq-living-2",
    category: "living",
    question: "반려동물 승강기 탑승 및 층간소음 에티켓 안내",
    answer: "공동주택 생활 예절을 준수해 주시기 바랍니다.\n1. 승강기 및 복도 이동 시: 반려동물은 반드시 품에 안거나 전용 캐리어를 이용해 주십시오.\n2. 층간소음: 밤 10시 이후에는 실내 슬리퍼 착용, 세탁기/청소기 가동 자제, 헬스기구 사용을 삼가 주십시오.",
  },
];
