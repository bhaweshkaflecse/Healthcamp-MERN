import { ReactNode, createContext, useState } from "react";


export interface KYContext {
    isKycVerified: boolean;
    updateKycStatus: (status: string) => void;
}
export const KycContext = createContext<KYContext | null>(null);

export const KycContextProvider = ({ children }: { children: ReactNode }) => {
  const [isKycVerified, setIsKycVerified] = useState(false);

  const updateKycStatus = (status: string) => {
    if (status == "approved") {
      setIsKycVerified(true);
    } else {
      setIsKycVerified(false);
    }
  };
  return (
    <KycContext.Provider value={{ isKycVerified, updateKycStatus }}>
      {children}
    </KycContext.Provider>
  );
};
