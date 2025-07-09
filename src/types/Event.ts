export interface Event {
  id: string;
  museumId: string;
  title: string;
  description: string;
  eventDate: Date;
  endDate: Date | null;
  isPublished: boolean;
  isApproved: boolean;
  location: string;
  imageUrl: string | null;
  createdAt: Date | string;
}

// export const emptyEvent: Event = {
//   id: 0,
//   museumId: 0,
//   title: "",
//   description: "",
//   eventDate: new Date(),
//   endDate: null,
//   isPublished: false,
//   isApproved: false,
//   location: "",
//   imageUrl: null,
//   createdAt: new Date(),
// };

// export const emptyEventForCreation: Omit<Event, "id" | "createdAt"> = {
//   museumId: 0,
//   title: "",
//   description: "",
//   eventDate: new Date(),
//   endDate: null,
//   isPublished: false,
//   isApproved: false,
//   location: "",
//   imageUrl: null,
// };
