import { AuthStatus, links } from "@/app/NavBar";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { PiGithubLogoFill } from "react-icons/pi";

const DesktopNav = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-6 py-6 px-5 h-14 items-center">
        <Link href="http://github.com/JieLuis">
          <PiGithubLogoFill />
        </Link>
        <NavLinks />
      </div>
      <AuthStatus />
    </div>
  );
};
export default DesktopNav;

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
