"use client";
import ErrorBoundary from "@/components/dashboard/ErrorBoundary";
import AppShell from "@/components/dashboard/AppShell";

export default function AppWrapper() {
  return <ErrorBoundary><AppShell /></ErrorBoundary>;
}
