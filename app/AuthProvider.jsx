"use client";

import React, { useContext, useEffect } from "react";
import { useUser } from "./ContextProvider";
import { useRouter } from "next/navigation";

const AuthProvider = ({ children }) => {
  const { loading, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return null;
  return user ? children : null;
};

export default AuthProvider;
