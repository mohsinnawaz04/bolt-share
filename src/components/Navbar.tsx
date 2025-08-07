import Link from "next/link";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Menu, Moon } from "lucide-react";
import { ModeToggle } from "./ui/modeToggle";

export default function Navbar() {
  return (
    <header className="header">
      <h1>Bolt-Share</h1>
      <ul className="hidden md:grid grid-cols-4 md:gap-5 lg:gap-10">
        <li>
          <Link href={"#"} className="nav-link">
            <Button className="w-full">Home</Button>
          </Link>
        </li>
        <li>
          <Link href={"#"} className="nav-link">
            <Button className="w-full">About</Button>
          </Link>
        </li>
        <li>
          <Link href={"#"} className="nav-link">
            <Button className="w-full">Contact</Button>
          </Link>
        </li>
        <li>
          <Link href={"#"} className="nav-link">
            <Button className="w-full">Policy</Button>
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-5">
        <ModeToggle />
        <Button>
          <Menu />
        </Button>
      </div>
    </header>
  );
}
