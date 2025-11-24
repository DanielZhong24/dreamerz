"use client";

import * as React from "react";
import { House, Upload, Mail, AudioLines } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  tabs: [
    {
      name: "Home",
      url: "/dashboard",
      icon: House,
    },
    {
      name: "Text Upload",
      url: "#",
      icon: Upload,
    },
    {
      name: "Voice Upload",
      url: "#",
      icon: AudioLines,
    },
    {
      name: "Direct Messages",
      url: "#",
      icon: Mail,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser({
          name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
          email: user.email || "",
          avatar: user.user_metadata?.avatar_url || "",
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects tabs={data.tabs} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
