import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function ChooseGameModeLink({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="flex-1 bg-transparent border border-white hover:border-black hover:bg-cyan-500 text-white font-bold py-3 rounded-lg text-xl text-center"
    >
      {children}
    </Link>
  );
}
