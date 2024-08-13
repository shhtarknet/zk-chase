import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";
import { Input } from "../elements/input";

export const Rename = () => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { rename },
    },
  } = useDojo();
  const [name, setName] = useState("");

  const { player } = usePlayer({ playerId: account.address });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!name) return;
    setIsLoading(true);
    try {
      await rename({
        account: account as Account,
        name,
      });
    } finally {
      setIsLoading(false);
    }
  }, [account, name]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !name;
  }, [account, master, player, name]);

  return (
    <div className="flex gap-4 w-full">
      <Input
        className="grow"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Player name"
      />
      <Button
        disabled={disabled || isLoading}
        isLoading={isLoading}
        onClick={handleClick}
        className="text-xl"
      >
        Rename
      </Button>
    </div>
  );
};
