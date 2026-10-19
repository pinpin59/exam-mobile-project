import type { Credentials, User } from "@/types";

// Compte du faux backend : un User + son mot de passe.
// Le mot de passe reste ici, il ne doit jamais être renvoyé à l'app.
export type MockAccount = User & Pick<Credentials, "password">;

export const mockAccounts: MockAccount[] = [
  {
    id: "u1",
    firstName: "Kevin",
    lastName: "Pintar",
    email: "kevin@eventease.dev",
    password: "password123",
  },
  {
    id: "u2",
    firstName: "Camille",
    lastName: "Durand",
    email: "camille@eventease.dev",
    password: "password123",
  },
  {
    id: "u3",
    firstName: "Lucas",
    lastName: "Martin",
    email: "lucas@eventease.dev",
    password: "password123",
  },
  {
    id: "u4",
    firstName: "Inès",
    lastName: "Moreau",
    email: "ines@eventease.dev",
    password: "password123",
  },
];

// Les mêmes utilisateurs, sans mot de passe
export const mockUsers: User[] = mockAccounts.map(({ password, ...user }) => user);
