export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  excerpt: string;
  content: string[];
  images?: string[];
  mediaType?: "image" | "video" | "both";
  video?: string;
  note?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "food-bank-nyc-holiday-drive",
    title: "Food Bank for NYC Holiday Drive",
    date: "2024-12-18",
    cover: "Untitled_Artwork(3).jpg",
    excerpt: "Photographing the annual holiday drive for Food Bank for NYC.",
    content: [
      "This is placeholder copy for the Food Bank for NYC Holiday Drive article.",
      "Replace these paragraphs with your real story, details about the event, and reflections.",
    ],
  },
  {
    slug: "photographing-beep-ball",
    title: "Photographing Beep Ball",
    date: "2024-10-05",
    cover: "Untitled_Artwork(4).jpg",
    excerpt: "A day on the field documenting an incredible accessible sport.",
    content: [
      "This is placeholder copy for the Beep Ball article.",
      "You can write about the people you met, the challenges, and what you learned.",
    ],
  },
];
