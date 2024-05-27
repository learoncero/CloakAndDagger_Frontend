import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; // Optional onClick handler
};

export default function BackLink({ href, children, onClick }: Props) {
  return (
      <Link href={href} className="text-white text-lg mb-3 mt-4 block" onClick={onClick}>
        {children}
      </Link>
  );
}