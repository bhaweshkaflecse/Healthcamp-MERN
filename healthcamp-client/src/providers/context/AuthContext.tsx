import { ReactNode, createContext, useState } from "react";
import api from "../../api";
import { getAccessToken } from "../../api/auth";

interface AuthContextType {
  refreshToken: string | null;
  userInfo: any;
  setUserInfo: (info: any) => void;
  generateAcessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState({});

  const refreshToken =
    window.sessionStorage.getItem("rToken") ||
    window.localStorage.getItem("rToken");

  const setInfoUser = (arg: any) => {
    setInfoUser(arg);
  };
  
  const generateAcessToken = async (): Promise<string> => {
    const response = await api.post(getAccessToken, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    return `Bearer ${response.data}`;
  };

  return (
    <AuthContext.Provider
      value={{
        setUserInfo,
        userInfo,
        refreshToken,
        generateAcessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
