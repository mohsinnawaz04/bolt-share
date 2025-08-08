import { ModeToggle } from "./ui/modeToggle";
import Sidebar from "./Sidebar";
import Navlist from "./Navlist";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
  return (
    <header className="header">
      <h1>Bolt-Share</h1>
      <Navlist />
      <div className="flex items-center gap-5">
        <ModeToggle />
        <Sidebar />
      </div>
    </header>
  );
}
