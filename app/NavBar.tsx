"use client";
import Skeleton from "@/app/components/Skeleton";
import React, { useState } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";
import SearchInput from "./components/SearchInput";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Box } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MenuOverlay from "./components/MenuOverlay";

const NavBar = () => {
  const [navBarOpen, setNavBarOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-opacity-90 bg-gradient-to-t from-primary-50 to-[#D1F0FA] text-[#1D3E56] border">
      <div className="flex justify-between items-center pr-5">
        <div className="block md:hidden">
          {!navBarOpen ? (
            <button
              onClick={() => setNavBarOpen(true)}
              className="flex items-center px-3 py-4 border rounded"
            >
              <Bars3Icon className="h-5 w-6" />
            </button>
          ) : (
            <button
              onClick={() => setNavBarOpen(false)}
              className="flex items-center px-3 py-4 border rounded"
            >
              <XMarkIcon className="h-5 w-6" />
            </button>
          )}
        </div>
        <div className="hidden md:flex space-x-6 py-6 px-5 h-14 items-center">
          <Link href="/">
            <PiGithubLogoFill />
          </Link>
          <NavLinks />
        </div>
        <AuthStatus />
      </div>
      {navBarOpen ? <MenuOverlay /> : null}
    </nav>
  );
};
export default NavBar;

const NavLinks = () => {
  const currentPath = usePathname();
  return (
    <ul className="flex space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            className={classNames({
              "nav-link": true,
              "!text-zinc-950": link.href === currentPath,
            })}
            href={link.href}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated")
    return (
      <Link className="nav-link" href="/api/auth/signin">
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
