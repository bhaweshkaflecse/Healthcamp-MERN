import {create} from 'zustand';
import {devtools, createJSONStorage} from 'zustand/middleware'


interface AuthState{
    accessToken : String | null;
    setAccessToken : (token: string) => void;
    isAuth: boolean | null;
    setIsAuth: (auth: boolean) => void;

}


const authStore = (set: any): AuthState =>({
    accessToken: null,
    setAccessToken: (token:string) => set({accessToken: token}),
    isAuth: null,
    setIsAuth: (auth: boolean) => set({ isAuth: auth }),
})

// const useAuthStore = create<AuthState>()

const useAuthStore = create<AuthState>()(
    devtools(authStore,{
        name: 'auth',
        storage: createJSONStorage(() => localStorage)
    })
)

export default useAuthStore