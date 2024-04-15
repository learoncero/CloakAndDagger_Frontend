import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function BackLink({ href, children }: Props) {
  return (
    <Link href={href} className="text-white text-lg mb-4 block">
      {children}
    </Link>
  );
}
