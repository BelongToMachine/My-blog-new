import { LuMoreVertical } from "react-icons/lu";
import React from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import Link from "next/link";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { FaBook } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";

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
            <div key={index}>
              <DropdownMenu.Item className="flex justify-between">
                <Link key={link.href} href={link.href} className="pr-3">
                  {link.label}
                </Link>
                <Icon label={link.label} />
              </DropdownMenu.Item>
            </div>
          );
        })}
        <DropdownMenu.Separator />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

const mobileLinks = [
  { label: "Blogs", href: "/blogs" },
  { label: "Instagram", href: "https://www.instagram.com/henrqaz/" },
];

const Icon = ({ label }: { label: string }) => {
  switch (label) {
    case "Blogs":
      return <FaBook />;
    case "Instagram":
      return <IoLogoInstagram />;
  }
};
