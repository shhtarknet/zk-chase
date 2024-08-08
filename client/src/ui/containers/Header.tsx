import { useMemo } from "react";
import { Account } from "@/ui/components/Account";
import { ModeToggle } from "@/ui/components/Theme";
// import { useDojo } from "@/dojo/useDojo";
// import { usePlayer } from "@/hooks/usePlayer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/elements/sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faXTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { Button } from "../elements/button";
import { User } from "lucide-react";
import logo from "/assets/logo.png";

export const Header = () => {
  // const {
  //   account: { account },
  // } = useDojo();

  // const { player } = usePlayer({ playerId: account.address });
  const player = undefined;

  const links = useMemo(
    () => [
      {
        name: "Github",
        url: "https://github.com/shhtarknet/zkchase",
        icon: faGithub,
      },
      {
        name: "Twitter",
        url: "https://x.com/ohayo_dojo",
        icon: faXTwitter,
      },
      {
        name: "Discord",
        url: "https://discord.gg/dojoengine",
        icon: faDiscord,
      },
    ],
    [],
  );

  return (
    <div className="w-full flex justify-between items-center px-8 py-2">
      <div className="flex gap-4 items-center">
        <img src={logo} alt="ZK-Chase" className="h-12" />
        <p className="text-4xl font-bold">ZK-Chase</p>
      </div>
      <div className="flex gap-4 items-center">
        {/* {!!player && (
          <p className="font-['Norse'] text-2xl max-w-44 truncate">
            {player.name}
          </p>
        )} */}
        <ModeToggle />
        <Sheet>
          <SheetTrigger asChild className="cursor-pointer">
            <Button variant="outline" size="icon">
              <User className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              <span className="sr-only">Open settings</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col justify-between">
            <SheetHeader>
              <SheetTitle className="text-3xl">Settings</SheetTitle>
              <SheetDescription className="font-['Norse'] text-xl">
                Manage your account and preferences
              </SheetDescription>
              <div className="flex flex-col gap-8 py-8">
                <div className="flex flex-col gap-2 items-start">
                  <p className="text-2xl">Account</p>
                  <Account />
                </div>
              </div>
            </SheetHeader>
            <SheetFooter>
              <div className="w-full flex justify-center gap-8">
                {links.map((link, index) => (
                  <a
                    key={index}
                    className="flex justify-center items-center hover:scale-105 duration-200"
                    href={link.url}
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={link.icon as any} className="h-6" />
                  </a>
                ))}
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};