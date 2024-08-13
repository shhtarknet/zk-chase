import { ModeToggle } from "@/ui/components/Theme";
import logo from "/assets/logo.png";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "@/hooks/usePlayer";
import { AccountPannel } from "../modules/AccountPannel";
import { GamePannel } from "../modules/GamePannel";

export const Header = () => {
  const {
    account: { account },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  return (
    <div className="w-full flex justify-between items-center px-8 py-2">
      <div className="flex gap-4 items-center">
        <GamePannel />
        <img src={logo} alt="ZK-Chase" className="h-12" />
        <p className="text-4xl font-bold">ZK-Chase</p>
      </div>
      <div className="flex gap-4 items-center">
        {!!player && (
          <p className="font-['Indie Flower'] text-2xl max-w-44 truncate">
            {player.name}
          </p>
        )}
        <ModeToggle />
        <AccountPannel />
      </div>
    </div>
  );
};
