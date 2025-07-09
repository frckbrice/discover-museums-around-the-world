export interface Story {
  id: string;
  museumId: string;
  title: string;
  content: string;
  summary: string;
  featuredImageUrl: string | null;
  isPublished: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  tags: string[] | null;
}

// export const emptyStory: Story = {
//   id: 0,
//   museumId: 0,
//   title: "",
//   content: "",
//   summary: "",
//   featuredImageUrl: null,
//   isPublished: false,
//   isApproved: false,
//   isFeatured: false,
//   publishedAt: null,
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   tags: [],
// };
// export const emptyStoryForCreation: Omit<
//   Story,
//   "id" | "createdAt" | "updatedAt"
// > = {
//   museumId: 0,
//   title: "",
//   content: "",
//   summary: "",
//   featuredImageUrl: null,
//   isPublished: false,
//   isApproved: false,
//   isFeatured: false,
//   publishedAt: null,
//   tags: [],
// };
