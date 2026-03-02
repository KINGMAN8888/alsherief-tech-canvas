export interface Post {
  slug: string;
  date: string;
  readingTime: string;
  image: string;
  color: string;
}

export const posts: Post[] = [
  {
    slug: "building-ai-telegram-bots-python",
    date: "2025-12-15",
    readingTime: "8 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    color: "from-cyan-500 to-blue-500",
  },
  {
    slug: "hardware-to-cloud-fullstack-journey",
    date: "2025-11-20",
    readingTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    color: "from-violet-500 to-purple-500",
  },
  {
    slug: "production-vps-docker-setup",
    date: "2025-10-08",
    readingTime: "10 min read",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop",
    color: "from-emerald-500 to-teal-500",
  },
];
