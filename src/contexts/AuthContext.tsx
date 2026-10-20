import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import * as authService from "@/services/auth";
import type { Credentials, SignUpData, User } from "@/types";

const KEY = "@eventease/session";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage : on relit l'utilisateur enregistré pour rester connecté
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((saved) => {
        if (saved) setUser(JSON.parse(saved));
      })
      .catch(() => AsyncStorage.removeItem(KEY)) // session illisible : on repart de zéro
      .finally(() => setIsLoading(false));
  }, []);

  // Enregistre l'utilisateur dans l'état React ET sur le téléphone
  const saveSession = async (u: User) => {
    setUser(u);
    await AsyncStorage.setItem(KEY, JSON.stringify(u));
  };

  // Pas de try/catch ici : si le service lance une erreur, elle remonte
  // jusqu'à l'écran, qui l'affichera (ex : « Email or password incorrect »)
  const login = async (credentials: Credentials) => {
    await saveSession(await authService.login(credentials));
  };

  const signUp = async (data: SignUpData) => {
    await saveSession(await authService.signUp(data));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  return ctx;
}
