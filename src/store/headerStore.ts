import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUser } from "@/lib/api/user";

export interface HeaderTeam {
  teamId: string;
  teamName: string;
  teamImage: string | null;
  role: string;
}

interface HeaderStoreState {
  userId: number | null;
  isLogin: boolean;
  nickname: string | null;
  profileImage: string | null;
  teams: HeaderTeam[];
  activeTeam: HeaderTeam | null;
  setActiveTeam: (team: HeaderTeam) => void;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

// 헤더에서 쓰이는 전역상태 관리입니다.
export const useHeaderStore = create<HeaderStoreState>()(
  persist(
    (set, get) => ({
      userId: null,
      isLogin: false,
      nickname: null,
      profileImage: null,
      teams: [],
      activeTeam: null,

      // 유저 정보를 갖고옵니다. 팀 소속 여부에 따라 분기점이 다릅니다.
      fetchUser: async () => {
        const res = await getUser();

        if ("error" in res) {
          set({
            userId: null,
            isLogin: false,
            nickname: null,
            profileImage: null,
            teams: [],
            activeTeam: null,
          });
          return;
        }

        const teams: HeaderTeam[] = res.memberships.map((team) => ({
          teamId: team.group.id.toString(),
          teamName: team.group.name,
          teamImage: team.group.image,
          role: team.role,
        }));

        const { activeTeam } = get();

        // 팀 소속이 없을 때 전역상태 설정
        if (teams.length === 0) {
          set({
            userId: res.id,
            isLogin: true,
            nickname: res.nickname,
            profileImage: res.image,
            teams: [],
            activeTeam: null,
          });

          return;
        }

        // Header 로고 옆에 뜨는 대표 팀목록, 첫 번째 원소가 나오게 설정하였습니다.
        // 사용자가 클릭 한 팀에 맞게 반영하였습니다.
        const nextActiveTeam = activeTeam
          ? (teams.find((t) => t.teamId === activeTeam.teamId) ?? teams[0])
          : teams[0];

        set({
          userId: res.id,
          isLogin: true,
          nickname: res.nickname,
          profileImage: res.image,
          teams,
          activeTeam: nextActiveTeam ?? null,
        });
      },

      // 로그아웃 하면 작동하는 전역 함수입니다.
      clearUser: () => {
        set({
          userId: null,
          isLogin: false,
          nickname: null,
          profileImage: null,
          teams: [],
          activeTeam: null,
        });
      },

      setActiveTeam: (team) => set({ activeTeam: team }),
    }),
    {
      name: "header-store",
      // 새로 고침해도 activeTeam가 유지됩니다.
      partialize: (state) => ({
        activeTeam: state.activeTeam,
      }),
    }
  )
);
