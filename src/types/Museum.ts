export interface Museum {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  logoUrl: string | null;
  featuredImageUrl: string | null;
  website: string | null;
  isApproved: boolean;
  isActive: boolean;
  isFeatured: boolean;
  museumType: string; // You can narrow this down if known types
  coordinates: { lat: number; lng: number } | null;
  createdAt: Date | string;
}

// export const emptyMuseum: Museum = {
//   id: 0,
//   name: "",
//   description: "",
//   location: "",
//   city: "",
//   country: "",
//   logoUrl: null,
//   featuredImageUrl: null,
//   website: null,
//   isApproved: false,
//   isActive: true,
//   isFeatured: false,
//   museumType: "",
//   coordinates: null,
//   createdAt: new Date(),
// };
// export const emptyMuseumForCreation: Omit<Museum, "id" | "createdAt"> = {
//   name: "",
//   description: "",
//   location: "",
//   city: "",
//   country: "",
//   logoUrl: null,
//   featuredImageUrl: null,
//   website: null,
//   isApproved: false,
//   isActive: true,
//   isFeatured: false,
//   museumType: "",
//   coordinates: null,
// };
