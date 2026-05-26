import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useGlobalContext = ():any => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within an AuthProvider");
  }
  return context;
};
export default useGlobalContext;
