"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Notice,
  MaintenanceBill,
  OperatingFundRecord,
  FAQItem,
} from "@/types";
import {
  INITIAL_NOTICES,
  INITIAL_MAINTENANCE_BILLS,
  INITIAL_OPERATING_FUNDS,
  INITIAL_FAQS,
} from "@/lib/mockData";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

interface DataContextType {
  notices: Notice[];
  bills: MaintenanceBill[];
  funds: OperatingFundRecord[];
  faqs: FAQItem[];
  currentFundBalance: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;

  // 공지사항 CRUD
  addNotice: (notice: Omit<Notice, "id" | "createdAt" | "viewCount">) => Promise<void>;
  updateNotice: (id: string, updated: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  incrementNoticeView: (id: string) => void;

  // 관리비 CRUD
  addBill: (bill: Omit<MaintenanceBill, "id" | "createdAt">) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;

  // 운영회비 CRUD
  addFundRecord: (record: Omit<OperatingFundRecord, "id" | "balanceAfter">) => Promise<void>;
  deleteFundRecord: (id: string) => Promise<void>;

  // FAQ CRUD
  addFAQ: (faq: Omit<FAQItem, "id">) => Promise<void>;
  updateFAQ: (id: string, updated: Partial<FAQItem>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  // 초기 데이터 리셋
  resetToDefaultData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const KEY_NOTICES = "unique_central_notices";
const KEY_BILLS = "unique_central_bills";
const KEY_FUNDS = "unique_central_funds";
const KEY_FAQS = "unique_central_faqs";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bills, setBills] = useState<MaintenanceBill[]>([]);
  const [funds, setFunds] = useState<OperatingFundRecord[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // 초기 데이터 로딩
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isFirebaseConfigured && db) {
      try {
        // Firestore에서 로드
        const noticesSnap = await getDocs(query(collection(db, "notices"), orderBy("createdAt", "desc")));
        if (!noticesSnap.empty) {
          setNotices(noticesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Notice)));
        } else {
          setNotices(INITIAL_NOTICES);
        }

        const billsSnap = await getDocs(query(collection(db, "bills"), orderBy("yearMonth", "desc")));
        if (!billsSnap.empty) {
          setBills(billsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as MaintenanceBill)));
        } else {
          setBills(INITIAL_MAINTENANCE_BILLS);
        }

        const fundsSnap = await getDocs(query(collection(db, "funds"), orderBy("date", "desc")));
        if (!fundsSnap.empty) {
          setFunds(fundsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as OperatingFundRecord)));
        } else {
          setFunds(INITIAL_OPERATING_FUNDS);
        }

        const faqsSnap = await getDocs(collection(db, "faqs"));
        if (!faqsSnap.empty) {
          setFaqs(faqsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as FAQItem)));
        } else {
          setFaqs(INITIAL_FAQS);
        }
        return;
      } catch (err) {
        console.warn("Firestore fetch error, falling back to local storage:", err);
      }
    }

    // LocalStorage Fallback
    try {
      const storedNotices = localStorage.getItem(KEY_NOTICES);
      setNotices(storedNotices ? JSON.parse(storedNotices) : INITIAL_NOTICES);

      const storedBills = localStorage.getItem(KEY_BILLS);
      setBills(storedBills ? JSON.parse(storedBills) : INITIAL_MAINTENANCE_BILLS);

      const storedFunds = localStorage.getItem(KEY_FUNDS);
      setFunds(storedFunds ? JSON.parse(storedFunds) : INITIAL_OPERATING_FUNDS);

      const storedFaqs = localStorage.getItem(KEY_FAQS);
      setFaqs(storedFaqs ? JSON.parse(storedFaqs) : INITIAL_FAQS);
    } catch {
      setNotices(INITIAL_NOTICES);
      setBills(INITIAL_MAINTENANCE_BILLS);
      setFunds(INITIAL_OPERATING_FUNDS);
      setFaqs(INITIAL_FAQS);
    }
  };

  // LocalStorage 저장 헬퍼
  const saveNotices = (data: Notice[]) => {
    setNotices(data);
    localStorage.setItem(KEY_NOTICES, JSON.stringify(data));
  };
  const saveBills = (data: MaintenanceBill[]) => {
    setBills(data);
    localStorage.setItem(KEY_BILLS, JSON.stringify(data));
  };
  const saveFunds = (data: OperatingFundRecord[]) => {
    setFunds(data);
    localStorage.setItem(KEY_FUNDS, JSON.stringify(data));
  };
  const saveFaqs = (data: FAQItem[]) => {
    setFaqs(data);
    localStorage.setItem(KEY_FAQS, JSON.stringify(data));
  };

  // 공지사항 CRUD
  const addNotice = async (noticeData: Omit<Notice, "id" | "createdAt" | "viewCount">) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      viewCount: 1,
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "notices"), newNotice);
        newNotice.id = docRef.id;
      } catch (e) {
        console.error("Firebase write error:", e);
      }
    }

    saveNotices([newNotice, ...notices]);
  };

  const updateNotice = async (id: string, updated: Partial<Notice>) => {
    const next = notices.map((n) => (n.id === id ? { ...n, ...updated } : n));
    saveNotices(next);
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "notices", id), updated);
      } catch (e) {
        console.error("Firebase update error:", e);
      }
    }
  };

  const deleteNotice = async (id: string) => {
    const next = notices.filter((n) => n.id !== id);
    saveNotices(next);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "notices", id));
      } catch (e) {
        console.error("Firebase delete error:", e);
      }
    }
  };

  const incrementNoticeView = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, viewCount: n.viewCount + 1 } : n))
    );
  };

  // 관리비 CRUD
  const addBill = async (billData: Omit<MaintenanceBill, "id" | "createdAt">) => {
    const newBill: MaintenanceBill = {
      ...billData,
      id: `bill-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "bills"), newBill);
        newBill.id = docRef.id;
      } catch (e) {
        console.error("Firebase write error:", e);
      }
    }

    saveBills([newBill, ...bills]);
  };

  const deleteBill = async (id: string) => {
    const next = bills.filter((b) => b.id !== id);
    saveBills(next);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "bills", id));
      } catch (e) {
        console.error("Firebase delete error:", e);
      }
    }
  };

  // 운영회비 CRUD
  const addFundRecord = async (
    recordData: Omit<OperatingFundRecord, "id" | "balanceAfter">
  ) => {
    // 최신 잔액 계산
    const currentBal = funds.length > 0 ? funds[0].balanceAfter : 0;
    const newBal =
      recordData.type === "income"
        ? currentBal + recordData.amount
        : currentBal - recordData.amount;

    const newRecord: OperatingFundRecord = {
      ...recordData,
      id: `fund-${Date.now()}`,
      balanceAfter: newBal,
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "funds"), newRecord);
        newRecord.id = docRef.id;
      } catch (e) {
        console.error("Firebase write error:", e);
      }
    }

    saveFunds([newRecord, ...funds]);
  };

  const deleteFundRecord = async (id: string) => {
    const next = funds.filter((f) => f.id !== id);
    saveFunds(next);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "funds", id));
      } catch (e) {
        console.error("Firebase delete error:", e);
      }
    }
  };

  // FAQ CRUD
  const addFAQ = async (faqData: Omit<FAQItem, "id">) => {
    const newFaq: FAQItem = {
      ...faqData,
      id: `faq-${Date.now()}`,
    };
    saveFaqs([...faqs, newFaq]);
  };

  const updateFAQ = async (id: string, updated: Partial<FAQItem>) => {
    const next = faqs.map((f) => (f.id === id ? { ...f, ...updated } : f));
    saveFaqs(next);
  };

  const deleteFAQ = async (id: string) => {
    const next = faqs.filter((f) => f.id !== id);
    saveFaqs(next);
  };

  const resetToDefaultData = () => {
    saveNotices(INITIAL_NOTICES);
    saveBills(INITIAL_MAINTENANCE_BILLS);
    saveFunds(INITIAL_OPERATING_FUNDS);
    saveFaqs(INITIAL_FAQS);
  };

  // 요약 통계 계산
  const currentFundBalance = funds.length > 0 ? funds[0].balanceAfter : 0;

  // 이번 달 수입/지출 계산 (Next.js prerender 안정성을 위해 useEffect에서 초기화)
  const [currentYearMonth, setCurrentYearMonth] = useState<string>("");

  useEffect(() => {
    setCurrentYearMonth(new Date().toISOString().slice(0, 7));
  }, []);

  const thisMonthFunds = currentYearMonth
    ? funds.filter((f) => f.date.startsWith(currentYearMonth))
    : (funds.length > 0 ? funds.filter((f) => f.date.startsWith(funds[0].date.slice(0, 7))) : []);

  const totalIncomeThisMonth = thisMonthFunds
    .filter((f) => f.type === "income")
    .reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpenseThisMonth = thisMonthFunds
    .filter((f) => f.type === "expense")
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <DataContext.Provider
      value={{
        notices,
        bills,
        funds,
        faqs,
        currentFundBalance,
        totalIncomeThisMonth,
        totalExpenseThisMonth,
        addNotice,
        updateNotice,
        deleteNotice,
        incrementNoticeView,
        addBill,
        deleteBill,
        addFundRecord,
        deleteFundRecord,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        resetToDefaultData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
