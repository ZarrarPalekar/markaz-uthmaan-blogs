import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full relative flex items-center justify-between max-w-2xl mx-auto px-4 py-5">
      <Link href="/" className="font-bold text-3xl flex items-center">
        <Image src={"/logo.png"} alt="image" width={50} height={50} />
        <span className="ml-2">Markaz</span>
        <span className="text-primary">Uthmaan</span>
      </Link>

      <ModeToggle />
    </nav>
  );
}
