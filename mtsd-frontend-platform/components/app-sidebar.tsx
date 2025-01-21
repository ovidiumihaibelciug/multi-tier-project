"use client";

import React, * as React from "react";
import {
  BookOpen,
  FileText,
  MessageCircle,
  PieChart,
  Settings2,
  TvIcon,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "next-auth";

const data = {
  user: {
    name: "John Doe",
    email: "johndoe@student.com",
    avatar: "/avatars/johndoe.jpg",
  },
  teams: [
    {
      name: "Harvard University",
      logo: TvIcon,
      plan: "Student",
    },
    {
      name: "MIT",
      icon: TvIcon,
      plan: "Student",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: React.Fragment,
      isActive: true,
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: BookOpen,
    },
    {
      title: "Chat",
      url: "/dashboard/chat",
      icon: MessageCircle,
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user as User} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
