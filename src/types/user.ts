export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface Credentials {
  email: string;
  password: string;
}

export type SignUpData = Omit<User, "id"> & Pick<Credentials, "password">;

export type UserRole = "volunteer" | "user";
