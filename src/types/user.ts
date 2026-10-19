export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export type SignUpData = Omit<User, "id"> & Pick<Credentials, "password">;
