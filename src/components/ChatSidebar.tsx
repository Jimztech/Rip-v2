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
import { TrendingUp, MessageCirclePlus } from "lucide-react";
import { Link } from "react-router-dom";

// Menu items.
const items = [
    {
        title: "Trending",
        url: "/trending",
        icon: TrendingUp,
    },
    {
        title: "New chat",
        url: "/chat",
        icon: MessageCirclePlus,
    },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Rip</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

