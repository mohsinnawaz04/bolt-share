import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ui/modeToggle";
import Sidebar from "./Sidebar";
import Navlist from "./Navlist";

export default function Navbar() {
  return (
    <header className="header">
      <h1>Bolt-Share</h1>
      <Navlist />
      <div className="flex items-center gap-5">
        <ModeToggle />
        {/* <Button className="block md:hidden">
          <Menu />
        </Button> */}
        <Sidebar />
      </div>
    </header>
  );
}
