import { useMemo } from "react";
import { Account } from "@/ui/components/Account";
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
import { Rename } from "../actions/Rename";
import { usePlayer } from "@/hooks/usePlayer";
import { useDojo } from "@/dojo/useDojo";
import { Signup } from "../actions/signup";

export const AccountPannel = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

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
          <SheetDescription className="font-['Indie Flower'] text-xl">
            Manage your account and preferences
          </SheetDescription>
          <div className="flex flex-col gap-8 py-8">
            <div className="flex flex-col gap-2 items-start">
              <p className="text-2xl">Account</p>
              <Account />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <p className="text-2xl">Profile</p>
              {!player && <Signup />}
              {!!player && <Rename />}
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
  );
};
