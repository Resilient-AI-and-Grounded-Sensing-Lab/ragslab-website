"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { assetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

type SiteHeaderProps = {
  courseSlugs: string[];
};

function isActivePath(pathname: string, href: string, courseSlugs: string[]) {
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  if (pathname.startsWith(`${href}/`)) return true;
  if (href === "/teaching" && courseSlugs.some((slug) => pathname === `/${slug}`)) return true;
  return false;
}

export function SiteHeader({ courseSlugs }: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-mark" href="/" aria-label="RAGS Lab home">
          <img src={assetPath("/brand/logo-no-text.svg")} alt="" />
          <span>{siteConfig.name}</span>
        </Link>
        <nav aria-label="Primary navigation">
          {siteConfig.nav.map((item) => {
            const isActive = isActivePath(pathname, item.href, courseSlugs);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "is-active" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
