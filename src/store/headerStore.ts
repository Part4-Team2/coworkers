import { create } from "zustand";
import { getUser } from "@/api/user";

interface HeaderStoreState {
  isLogin: boolean;
  nickname: string | null;
  profileImage: string | null;
  teams: {
    teamId: string;
    teamName: string;
    teamImage: string | null;
  }[];
  activeTeam: {
    teamId: string;
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
      teamId: team.group.teamId,
      teamName: team.group.name,
      teamImage: team.group.image,
    }));

    const activeTeam = {
      teamId: teams[0].teamId,
      teamName: teams[0].teamName,
    };

    set({
      isLogin: true,
      nickname: res.nickname,
      profileImage: res.image,
      teams,
      activeTeam,
    });
  },

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
