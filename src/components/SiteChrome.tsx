"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import type { SiteContentValues } from "@/lib/site-content";

export function SiteChrome({
  children,
  globalContent,
}: {
  children: ReactNode;
  globalContent: SiteContentValues;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar content={globalContent} />
      <div className="flex-1">{children}</div>
      <Footer content={globalContent} />
    </>
  );
}
