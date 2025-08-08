import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Heart, Menu } from "lucide-react";
import Navlist from "./Navlist";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="block md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Bolt-Share</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            Made with <Heart className="fill-rose-600 stroke-none size-5" /> by
            Mohsin Nawaz
          </SheetDescription>
          <Navlist classNames="flex flex-col gap-3 mt-8 md:hidden" />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
