export interface Analytic {
  id: string;
  museumId: string;
  storyId: string | null;
  pageType: string; // museum_profile, story, gallery, etc.
  views: number;
  date: Date | string;
}

// export const emptyAnalytics: Analytic = {
//   id: 0,
//   museumId: 0,
//   storyId: null,
//   pageType: "",
//   views: 0,
//   date: new Date(),
// };

// export const emptyAnalyticsForCreation: Omit<Analytic, "id" | "date"> = {
//   museumId: 0,
//   storyId: null,
//   pageType: "",
//   views: 0,
// };
