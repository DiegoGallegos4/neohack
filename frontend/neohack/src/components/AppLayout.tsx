import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/App-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className=" ">
      <AppSidebar />
      <main className=" h-screen w-full">{children}</main>
    </SidebarProvider>
  );
}
