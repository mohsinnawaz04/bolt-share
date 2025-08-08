import Link from "next/link";
import { Button } from "./ui/button";

export default function Navlist({className="hidden md:grid grid-cols-4 md:gap-5 lg:gap-10"}) {
    return (
        <ul className={className}>
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
    );
}