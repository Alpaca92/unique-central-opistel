"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, ResidentType, UserRole } from "@/types";
import { DEFAULT_ADMIN_USER, DEFAULT_RESIDENT_USER, DEFAULT_GROUP_PASSCODE } from "@/lib/mockData";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isVerifiedResident: boolean;
  loginWithKakao: () => Promise<void>;
  simulateKakaoLogin: (role?: UserRole) => void;
  logout: () => void;
  verifyResident: (passcode: string, building: string, roomNumber: string, residentType: ResidentType) => { success: boolean; message: string };
  toggleAdminRole: () => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  groupPasscode: string;
  updateGroupPasscode: (newPasscode: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "unique_central_user";
const STORAGE_KEY_PASSCODE = "unique_central_group_passcode";

declare global {
  interface Window {
    Kakao?: any;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [groupPasscode, setGroupPasscode] = useState(DEFAULT_GROUP_PASSCODE);

  // 초기 로드 시 로컬스토리지에서 복원
  useEffect(() => {
    try {
      const storedPasscode = localStorage.getItem(STORAGE_KEY_PASSCODE);
      if (storedPasscode) {
        setGroupPasscode(storedPasscode);
      }

      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // 첫 방문 시에는 로그인 상태 없이 둘러볼 수 있도록 null 유지, 혹은 간편 확인을 위해 기본 입주민 제공 가능
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 상태 변경 시 로컬스토리지 동기화
  const saveUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  };

  // 카카오 공식 SDK 로그인 시도
  const loginWithKakao = async () => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

    if (typeof window !== "undefined" && window.Kakao && kakaoKey) {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }

      window.Kakao.Auth.login({
        scope: "profile_nickname,profile_image",
        success: (authObj: any) => {
          window.Kakao.API.request({
            url: "/v2/user/me",
            success: (res: any) => {
              const kakaoAccount = res.kakao_account;
              const newUser: User = {
                id: `kakao-${res.id}`,
                kakaoId: String(res.id),
                nickname: kakaoAccount?.profile?.nickname || "카카오 입주민",
                profileImage: kakaoAccount?.profile?.profile_image_url,
                isVerified: false, // 단톡방 인증 전 상태!
                role: "resident",
                joinedAt: new Date().toISOString().split("T")[0],
              };
              saveUser(newUser);
              setIsLoginModalOpen(false);
              // 단톡방 인증 모달 오픈
              setIsVerificationModalOpen(true);
            },
            fail: (error: any) => {
              console.error("Kakao API request failed:", error);
              simulateKakaoLogin("resident");
            },
          });
        },
        fail: (err: any) => {
          console.error("Kakao Login failed:", err);
          simulateKakaoLogin("resident");
        },
      });
    } else {
      // 카카오 키가 없거나 미설정된 경우 모의 로그인 창으로 연결
      simulateKakaoLogin("resident");
    }
  };

  // 모의 카카오 로그인 (개발/테스트 및 키 미발급 시 1초 만에 테스트 가능)
  const simulateKakaoLogin = (role: UserRole = "resident") => {
    const mockUser: User =
      role === "admin"
        ? DEFAULT_ADMIN_USER
        : {
            ...DEFAULT_RESIDENT_USER,
            id: `kakao-test-${Date.now().toString().slice(-4)}`,
            isVerified: false, // 처음에는 단톡방 인증을 거치도록 설정하여 플로우를 보여줌
          };

    saveUser(mockUser);
    setIsLoginModalOpen(false);

    if (!mockUser.isVerified) {
      setIsVerificationModalOpen(true);
    }
  };

  const logout = () => {
    saveUser(null);
  };

  // 단톡방 인증코드를 통한 입주민 확인
  const verifyResident = (
    passcode: string,
    building: string,
    roomNumber: string,
    residentType: ResidentType
  ) => {
    if (passcode.trim().toUpperCase() !== groupPasscode.trim().toUpperCase()) {
      return {
        success: false,
        message: "단톡방 공지 인증코드가 일치하지 않습니다. 단톡방 공지사항을 확인해 주세요.",
      };
    }

    if (!roomNumber.trim()) {
      return {
        success: false,
        message: "호수를 입력해 주세요 (예: 1204호).",
      };
    }

    if (!user) {
      return {
        success: false,
        message: "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
      };
    }

    const updatedUser: User = {
      ...user,
      building: building.trim() || "101동",
      roomNumber: roomNumber.trim(),
      residentType,
      isVerified: true,
      nickname: `${user.nickname.split(" (")[0]} (${roomNumber.trim()})`,
    };

    saveUser(updatedUser);
    setIsVerificationModalOpen(false);

    return {
      success: true,
      message: "입주민 인증이 완료되었습니다. 환영합니다!",
    };
  };

  // 관리자 권한 토글 (테스트 및 입대의 시연용)
  const toggleAdminRole = () => {
    if (!user) return;
    const newRole: UserRole = user.role === "admin" ? "resident" : "admin";
    const updatedUser: User = {
      ...user,
      role: newRole,
      isVerified: true,
    };
    saveUser(updatedUser);
  };

  // 단톡방 암호 변경 (관리자 전용 기능)
  const updateGroupPasscode = (newPasscode: string) => {
    const code = newPasscode.trim().toUpperCase();
    setGroupPasscode(code);
    localStorage.setItem(STORAGE_KEY_PASSCODE, code);
  };

  const isAdmin = user?.role === "admin";
  const isVerifiedResident = Boolean(user && user.isVerified);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isVerifiedResident,
        loginWithKakao,
        simulateKakaoLogin,
        logout,
        verifyResident,
        toggleAdminRole,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        groupPasscode,
        updateGroupPasscode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
