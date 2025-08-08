import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
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
                    <SheetDescription>
                        Navigate the website using below links.
                    </SheetDescription>
                    <Navlist className="block flex flex-col gap-3 mt-10" />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}