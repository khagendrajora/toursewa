/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthUserType {
  authToken: string;
  businesId?: string;
  message: string;
  primaryEmail?: string;
  adminName?: string;
  adminEmail?: string;
  userId?: string;
  adminRole?: string;
  clientId?: string;
  userEmail?: string;
  userRole?: string;
  businessRole?: string;
  driver_id?: string;
  driverId?: string;
  driverEmail?: string;
  userName?: string;
  driverName?: string;
  businessName?: string;
  bId?: string;

  vehicleId?: string;
}

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
}>({
  authUser: null,
  setAuthUser: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    }
  }, [authUser]);
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
