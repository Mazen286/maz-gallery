export type BlogCategory = "Travel" | "Food" | "Video Games" | "Board Games" | "Random Thoughts"

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  category: BlogCategory
  image: string
  readTime: string
  published?: boolean
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Travel",
  "Food",
  "Video Games",
  "Board Games",
  "Random Thoughts",
]

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  "Travel": "#4ecdc4",
  "Food": "#f5a623",
  "Video Games": "#5b8def",
  "Board Games": "#c678dd",
  "Random Thoughts": "#78c8d6",
}

// Draft posts - set published: true when ready
export const ALL_POSTS: BlogPost[] = [
  {
    slug: "top-10-video-games",
    title: "My Top 10 Video Games of All Time",
    description:
      "Not ranked, just celebrated. These are the games that shaped how I think, gave me lifelong memories, and proved that video games are stories you're a part of.",
    date: "2026-04-01",
    category: "Video Games",
    image: "/images/blog/top-10-video-games.jpg",
    readTime: "12 min read",
    published: true,
  },
  {
    slug: "alanya-turkey-travel-guide",
    title: "Alanya Stole My Heart and I Want It Back",
    description:
      "Crystal water, ancient gates, and cats with more confidence than most people. A photo journal from the Turkish Riviera.",
    date: "2026-03-25",
    category: "Travel",
    image: "/images/gallery/Alanya-(9-of-20).jpg",
    readTime: "5 min read",
  },
  {
    slug: "overwatch-ranked-grind",
    title: "The Ranked Grind: Why I Keep Coming Back to Overwatch",
    description:
      "I should have quit seasons ago. But every time I think I'm done, the game pulls me back in. Here's why.",
    date: "2026-03-18",
    category: "Video Games",
    image: "/images/gallery/NewYork-9.jpg",
    readTime: "4 min read",
  },
  {
    slug: "new-york-food-spots",
    title: "Every Spot I Ate at in New York (Ranked)",
    description:
      "From Hell's Kitchen post-shutdown dining to a random bagel place that changed my life. The definitive list.",
    date: "2026-03-10",
    category: "Food",
    image: "/images/gallery/IMG_5085.jpg",
    readTime: "6 min read",
  },
  {
    slug: "designing-runes-and-reagents",
    title: "What I Learned Designing My First Game",
    description:
      "Runes & Reagents started as a napkin sketch. Here's how it became a playable game and what I'd do differently.",
    date: "2026-03-01",
    category: "Board Games",
    image: "/images/projects/runes-reagents.png",
    readTime: "7 min read",
  },
  {
    slug: "building-in-public",
    title: "Why I Build Everything in Public",
    description:
      "Side projects, startups, even this website. Sharing the process has been the single best decision for my career.",
    date: "2026-02-20",
    category: "Random Thoughts",
    image: "/images/gallery/Tomb.jpg",
    readTime: "3 min read",
  },
  {
    slug: "istanbul-layover",
    title: "A 12-Hour Layover in Istanbul Changed How I Travel",
    description:
      "We almost stayed in the airport. Instead we found wild boars, empty playgrounds at sunrise, and a reason to never skip a layover again.",
    date: "2026-02-12",
    category: "Travel",
    image: "/images/gallery/Istanbul-1.jpg",
    readTime: "5 min read",
  },
]

// Only published posts are shown on the site
export const BLOG_POSTS: BlogPost[] = ALL_POSTS.filter((p) => p.published)

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
