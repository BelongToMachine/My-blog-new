"use client";
import Skeleton from "@/app/components/Skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";
import SearchInput from "./components/SearchInput";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Box } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MenuOverlay from "./components/MenuOverlay";
import DesktopNav from "./components/navbar/DesktopNav";
import MobileNav from "./components/navbar/MobileNav";

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const updateWindowValue = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateWindowValue);

    return () => {
      window.removeEventListener("resize", updateWindowValue);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-opacity-90 bg-gradient-to-t from-primary-50 to-[#D1F0FA] text-[#1D3E56] border">
      {windowWidth > 768 ? <DesktopNav /> : <MobileNav />}
    </nav>
  );
};
export default NavBar;

export const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated")
    return (
      <Link className="nav-link pr-4" href="/api/auth/signin">
        Login
      </Link>
    );
  return (
    <Box>
      <Link href="/api/auth/signout">Log out</Link>
    </Box>
  );
};

export const links = [
  { label: "Home", href: "/" },
  { label: "About me", href: "#about-me-section" },
  { label: "Projects", href: "#projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "instagram", href: "https://www.instagram.com/henrqaz/" },
];
