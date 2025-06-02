"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If on /entry, skip auth check
    if (pathname === "/entry") {
      setLoading(false);
      return;
    }
    // If on /admin, check for admin_code
    if (pathname.startsWith("/admin")) {
      const adminKey = localStorage.getItem("admin_code");
      if (!adminKey) {
        router.replace("/entry");
        return;
      }
      // Optionally, validate admin code with API here if needed
      setLoading(false);
      return;
    }
    // If on / (home), check for super_secret_code
    if (pathname === "/") {
      const key = localStorage.getItem("super_secret_code");
      if (!key) {
        router.replace("/entry");
        return;
      }
      // Optionally, validate code with API here if needed
      setLoading(false);
      return;
    }
    // For all other pages, require either admin or user code
    const key = localStorage.getItem("super_secret_code");
    const adminKey = localStorage.getItem("admin_code");
    if (!key && !adminKey) {
      router.replace("/entry");
      return;
    }
    setLoading(false);
  }, [router, pathname]);

  if (loading) return null;
  return <>{children}</>;
}
