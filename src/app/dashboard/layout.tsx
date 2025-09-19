import DashboardLayout from '@/components/dashboard-layout';
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dashboard | EquipAI',
  description: 'Your personalized career dashboard.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
