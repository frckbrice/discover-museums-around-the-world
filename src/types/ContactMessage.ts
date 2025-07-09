export interface ContactMessage {
  id: string;
  museumId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  responseStatus: "pending" | "closed" | "replied";
  isRead: boolean;
  createdAt: Date | string;
}

// export const emptyContactMessage: ContactMessage = {
//   id: 0,
//   museumId: 0,
//   name: "",
//   email: "",
//   subject: "",
//   message: "",
//   isRead: false,
//   createdAt: new Date(),
// };

// export const emptyContactMessageForCreation: Omit<
//   ContactMessage,
//   "id" | "createdAt"
// > = {
//   museumId: 0,
//   name: "",
//   email: "",
//   subject: "",
//   message: "",
//   isRead: false,
// };
