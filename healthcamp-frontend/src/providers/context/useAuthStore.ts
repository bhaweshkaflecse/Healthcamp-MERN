import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  isAuth: boolean;
  setIsAuth: (auth: boolean) => void;
  isModelOpen: boolean;
  setIsModelOpen: (model: boolean) => void;
  isNewOrder: boolean;
  setIsNewOrder: (model: boolean) => void;
  clearModelOpen: () => void;
  role: string | null;
  setRole: (role: string) => void;
  reset: () => void; // Add reset function
}

const initialState: Omit<
  AuthState,
  | "setAccessToken"
  | "clearAccessToken"
  | "setIsAuth"
  | "setIsModelOpen"
  | "setIsNewOrder"
  | "clearModelOpen"
  | "setRole"
  | "reset"
> = {
  accessToken: null,
  isAuth: false,
  isModelOpen: true,
  isNewOrder: false,
  role: null,
};

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState, // Use initial state for default values
        setAccessToken: (token: string) => set({ accessToken: token }),
        clearAccessToken: () => set({ accessToken: null }),
        setIsAuth: (auth: boolean) => set({ isAuth: auth }),
        setIsModelOpen: (model: boolean) => set({ isModelOpen: model }),
        setIsNewOrder: (model: boolean) => set({ isNewOrder: model }),
        clearModelOpen: () => set({ isModelOpen: true }),
        setRole: (role: string) => set({ role }),
        reset: () => set({ ...initialState, accessToken: null }), // Reset state to initial values
      }),
      {
        name: "auth-storage", // LocalStorage key
        storage: createJSONStorage(() => localStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => key !== "accessToken")
          ), // Exclude accessToken
      }
    ),
    { name: "auth-store" }
  )
);

export default useAuthStore;
