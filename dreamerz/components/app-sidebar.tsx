"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

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
    <Sidebar
      variant="inset"
      className="bg-transparent [&>[data-slot=sidebar-inner]]:bg-transparent border-none"
      {...props}
    >
      <SidebarHeader>
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Dreamerz</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Explore the collective unconscious.
            <br />
            Connect with dreamers worldwide.
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
