import React from "react";
import { links } from "../NavBar";
import Link from "next/link";

interface Props {}

const MenuOverlay = () => {
  return (
    <ul className="flex flex-col py-4 items-center -mt-16">
      {links.map((link, index) => (
        <li key={index}>
          <Link href={link.href}>{link.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuOverlay;
