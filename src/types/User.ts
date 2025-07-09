export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: "museum_admin" | "super_admin";
  museumId: string | null;
  isActive: boolean;
  lastLoginAt: Date | string | null;
} 

// export const emptyUser: User = {
//   id: 0,
//   username: "",
//   password: "",
//   email: "",
//   fullName: "",
//   role: "museum_admin",
//   museumId: null,
//   isActive: true,
//   lastLoginAt: null,
// };

// export const emptyUserForCreation: Omit<User, "id" | "lastLoginAt"> = {
//   username: "",
//   password: "",
//   email: "",
//   fullName: "",
//   role: "museum_admin",
//   museumId: null,
//   isActive: true,
// };
