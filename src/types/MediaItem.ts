export interface MediaItem {
  id: string;
  museumId: string;
  title: string;
  description: string | null;
  mediaType: string; // image, video, audio, etc.
  url: string;
  isApproved: boolean;
  galleryId: string | null;
  tags: string[] | null;
  createdAt: Date | string;
}

// export const emptyMediaItem: MediaItem = {
//   id: 0,
//   museumId: 0,
//   title: "",
//   description: null,
//   mediaType: "",
//   url: "",
//   isApproved: false,
//   galleryId: null,
//   tags: [],
//   createdAt: new Date(),
// };

// export const emptyMediaItemForCreation: Omit<MediaItem, "id" | "createdAt"> = {
//   museumId: 0,
//   title: "",
//   description: null,
//   mediaType: "",
//   url: "",
//   isApproved: false,
//   galleryId: null,
//   tags: [],
// };
