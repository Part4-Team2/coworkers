import { create } from "zustand";
import { getUser } from "@/lib/api/user";

interface HeaderStoreState {
  isLogin: boolean;
  nickname: string | null;
  profileImage: string | null;
  teams: {
    teamId: number;
    teamName: string;
    teamImage: string | null;
  }[];
  activeTeam: {
    teamId: number;
    teamName: string;
  } | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

// 헤더에서 쓰이는 전역상태 관리입니다.
export const useHeaderStore = create<HeaderStoreState>((set) => ({
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
        isLogin: false,
        nickname: null,
        profileImage: null,
        teams: [],
        activeTeam: null,
      });
      return;
    }

    const teams = res.memberships.map((team) => ({
      teamId: team.group.id,
      teamName: team.group.name,
      teamImage: team.group.image,
    }));

    // 팀 소속이 없을 때 전역상태 설정
    if (teams.length === 0) {
      set({
        isLogin: true,
        nickname: res.nickname,
        profileImage: res.image,
        teams: [],
        activeTeam: null,
      });

      return;
    }

    // Header 로고 옆에 뜨는 대표 팀목록, 일단 첫 번째 원소가 나오게 설정하였습니다.
    const activeTeam =
      teams.length > 0
        ? {
            teamId: teams[0].teamId,
            teamName: teams[0].teamName,
          }
        : null;

    set({
      isLogin: true,
      nickname: res.nickname,
      profileImage: res.image,
      teams,
      activeTeam,
    });
  },

  // 로그아웃 하면 작동하는 전역 함수입니다.
  clearUser: () => {
    set({
      isLogin: false,
      nickname: null,
      profileImage: null,
      teams: [],
      activeTeam: null,
    });
  },
}));
