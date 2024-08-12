import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/elements/sheet";
import { Button } from "../elements/button";
import { Menu } from "lucide-react";
import { Signup } from "../actions/signup";
import { useGames } from "@/hooks/useGames";
import { Create } from "../actions/create";
import { Games } from "../containers/Games";

export const GamePannel = () => {
  const { games } = useGames();

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col justify-between">
        <SheetHeader>
          <SheetTitle className="text-3xl">Menu</SheetTitle>
          <SheetDescription className="font-['Indie Flower'] text-3xl">
            Games
          </SheetDescription>
          <Games />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
