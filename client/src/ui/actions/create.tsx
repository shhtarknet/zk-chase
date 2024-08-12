import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { usePlayer } from "@/hooks/usePlayer";

export const Create = () => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { create },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await create({
        account: account as Account,
      });
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player;
  }, [account, master, player]);

  return (
    <Button
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
      className="text-xl"
    >
      Create
    </Button>
  );
};
