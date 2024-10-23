"use client";

import AdminProtectedRoutes from "@/HOC/adminProtectedRoute";
import { ReactNode } from "react";
type AdminProtectedLayotType = {
  children: ReactNode;
};
export default function CompanyLayout({ children }: AdminProtectedLayotType) {
  return <AdminProtectedRoutes> {children}</AdminProtectedRoutes>
  ;
}