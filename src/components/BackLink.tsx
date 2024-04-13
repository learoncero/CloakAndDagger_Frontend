import Link from "next/link";

type Props = {
  href: string;
};

export default function BackLink({ href }: Props) {
  return (
    <Link href={href} className="text-white text-lg mb-4 block">
      Back
    </Link>
  );
}
