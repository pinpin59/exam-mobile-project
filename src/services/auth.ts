import { mockAccounts, type MockAccount } from "@/mocks";
import type { Credentials, SignUpData, User } from "@/types";

import { delay } from "./api";

// « Base de données » des comptes en mémoire, remise à zéro au redémarrage de l'app
const accounts: MockAccount[] = [...mockAccounts];

// "  Kevin@X.dev " → "kevin@x.dev" : évite les doublons dus aux majuscules ou espaces
const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Retire le mot de passe : il ne doit jamais être renvoyé à l'app
const toUser = ({ password: _password, ...user }: MockAccount): User => user;

export async function login({ email, password }: Credentials): Promise<User> {
  await delay();

  const account = accounts.find(
    (a) => a.email === normalizeEmail(email) && a.password === password,
  );
  // Même message si l'email ou le mot de passe est faux : on ne révèle pas quels emails existent
  if (!account) throw new Error("Email or password incorrect");

  return toUser(account);
}

export async function signUp(data: SignUpData): Promise<User> {
  await delay();

  const email = normalizeEmail(data.email);
  if (accounts.some((a) => a.email === email)) {
    throw new Error("Email already used");
  }

  // email placé après ...data pour remplacer l'email brut par sa version normalisée
  const account: MockAccount = { ...data, email, id: `u${Date.now()}` };
  accounts.push(account);

  return toUser(account);
}
