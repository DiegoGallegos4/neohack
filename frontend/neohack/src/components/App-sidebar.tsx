import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Investments",
    url: "/funding",
    icon: Inbox,
  },
  {
    title: "Lending",
    url: "/lending",
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <h1 className=" font-bold h-14  flex items-center justify-center text-xl">
            EthBank
          </h1>
          <SidebarGroupLabel className="text-xl text-primary"></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
