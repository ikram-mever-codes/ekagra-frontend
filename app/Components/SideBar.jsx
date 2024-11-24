"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import {
  Home,
  School,
  LocationCity,
  Domain,
  Class,
  LocalOffer,
  ExitToApp,
  Dashboard,
  DashboardOutlined,
  AdminPanelSettingsOutlined,
  CastForEducationOutlined,
} from "@mui/icons-material";
import { logout } from "../authApi";
import { useUser } from "../ContextProvider";

const menuItems = [
  { label: "Dashboard", icon: <DashboardOutlined />, path: "/" },
  {
    label: "Admissions",
    icon: <AdminPanelSettingsOutlined />,
    path: "/admin/admission",
  },
  { label: "Courses", icon: <School />, path: "/admin/courses" },
  {
    label: "Mode of Preparartion",
    icon: <CastForEducationOutlined />,
    path: "/admin/preparation",
  },
  { label: "Batch", icon: <Class />, path: "/admin/batch" },
  { label: "City", icon: <LocationCity />, path: "/admin/city" },
  { label: "Branch", icon: <Domain />, path: "/admin/branch" },
  { label: "Coupons", icon: <LocalOffer />, path: "/admin/coupons" },
];

const SideBar = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const path = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };
  const handleLogout = async () => {
    await logout(setUser);
  };
  return (
    <div className="w-full h-[90vh] py-8 px-6 bg-white text-gray-800 shadow-lg flex flex-col justify-between border-r border-[#2c3e50]">
      <List className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={path === item.path}
              className={`${
                path === item.path ? "bg-blue-500 text-white" : "text-gray-700"
              } hover:bg-blue-200 rounded-lg transition-all duration-300 p-3`}
            >
              <ListItemIcon
                className="flex justify-start items-center gap-4"
                sx={{
                  minWidth: "40px",
                  color: path === item.path ? "#11282E" : "gray",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  fontSize: "16px",
                  fontWeight: path === item.path ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider className="my-6" />

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex justify-center items-center gap-2 w-full h-[3rem] rounded-md bg-bg-gradient text-white font-medium text-[18px] hover:bg-[#1e2a3a] transition duration-300"
        >
          <ExitToApp sx={{ fontSize: "18px" }} /> Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
