import { useDojo } from "@/dojo/useDojo";
import { useCallback, useMemo, useState } from "react";
import { Account } from "starknet";
import { Button } from "@/ui/elements/button";
import { useGame } from "@/hooks/useGame";
import { usePlayer } from "@/hooks/usePlayer";
import { useNavigate } from "react-router-dom";
import { useChaser } from "@/hooks/useChaser";

export const Join = ({ gameId }: { gameId: number }) => {
  const {
    account: { account },
    master,
    setup: {
      systemCalls: { join },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { chaser } = useChaser({ playerId: account.address, gameId });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const setGameQueryParam = useCallback(
    (id: string) => navigate("?id=" + id, { replace: true }),
    [navigate],
  );

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    try {
      await join({
        account: account as Account,
        gameId,
      });
    } finally {
      setIsLoading(false);
      setGameQueryParam(gameId.toString());
    }
  }, [account, gameId]);

  const disabled = useMemo(() => {
    return !account || !master || account === master || !player || !!chaser;
  }, [account, master, player, chaser]);

  return (
    <Button
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
      className="text-xl"
    >
      Join
    </Button>
  );
};
