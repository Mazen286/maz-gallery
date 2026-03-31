import type { Metadata } from "next"
import { StoryEditor } from "@/components/gallery/story-editor"

export const metadata: Metadata = {
  title: "Story Editor",
  robots: { index: false },
}

export default function StoriesPage() {
  return <StoryEditor />
}
