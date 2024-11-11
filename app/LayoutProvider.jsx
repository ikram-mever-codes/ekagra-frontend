"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Header from "./Components/Header";
import SideBar from "./Components/SideBar";
import Footer from "./Components/Footer";
import AuthProvider from "./AuthProvider";
import { useUser } from "./ContextProvider";
import Loading from "./loading";

const LayoutProvider = ({ children }) => {
  const path = usePathname();
  const { loading } = useUser();

  const isSimpleLayout = ["/admission-form", "/login"].includes(path);

  if (loading) return <Loading />;

  if (isSimpleLayout) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <div className="bg-white min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-grow">
          <aside className="w-[15%]">
            <SideBar />
          </aside>
          <main className="w-[85%] p-4">{children}</main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default LayoutProvider;
