import { LuMoreVertical } from "react-icons/lu";
import React, { useState } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { FaBook } from "react-icons/fa6";
import classNames from "classnames";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  return (
    <>
      <div className="flex justify-between items-center px-4 py-4">
        <Link href="http://github.com/JieLuis">
          <PiGithubLogoFill />
        </Link>
        <Menu />
      </div>
    </>
  );
};

export default MobileNav;

const Menu = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" size="2">
          <LuMoreVertical />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1">
        {mobileLinks.map((link, index) => {
          return (
            <>
              <DropdownMenu.Item className="flex justify-between">
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
                <FaBook />
              </DropdownMenu.Item>
            </>
          );
        })}
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const mobileLinks = [
  { label: "Blogs", href: "/blogs" },
  { label: "instagram", href: "https://www.instagram.com/henrqaz/" },
];
