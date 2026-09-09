import { AppShell } from "@/components/layout/app-shell";

export default function AchievementLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="learner">{children}</AppShell>;
}
