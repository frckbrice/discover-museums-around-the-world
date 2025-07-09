export interface Timeline {
  id: string;
  storyId: string;
  title: string;
  description: string | null;
  timelinePoints: any[]; // Replace `any` with a proper type if known
  createdAt: Date | string;
  updatedAt: Date | string;
}
// export const emptyTimeline: Timeline = {
//   id: 0,
//   storyId: 0,
//   title: "",
//   description: null,
//   timelinePoints: [],
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };
// export const emptyTimelineForCreation: Omit<Timeline, "id" | "createdAt" | "updatedAt"> = {
//   storyId: 0,
//   title: "",
//   description: null,
//   timelinePoints: [],
// };