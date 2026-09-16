import { create } from "zustand";

export interface AuthUser {
  user_id?: string;
  name?: string;
  image?: string;
  email?: string;
  provider?: string;
}

type AuthUserStore = {
  authUser: AuthUser;
  setAuthUser: (newGame: AuthUser) => void;
};

export const useAuthUserStore = create<AuthUserStore>((set) => ({
  authUser: {} as AuthUser,
  setAuthUser: (newUser: AuthUser) => set({ authUser: newUser }),
}));
