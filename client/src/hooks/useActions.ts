import { useCallback, useEffect, useMemo } from "react";
import { useDojo } from "@/dojo/useDojo";
import { usePlayer } from "./usePlayer";
import { useGame } from "./useGame";
import PlayerManager from "@/phaser/managers/player";
import GameManager from "@/phaser/managers/game";
import { useChaser } from "./useChaser";
import { useChasers } from "./useChasers";

export const useActions = () => {
  const {
    account: { account },
    setup: {
      systemCalls: { signup, rename, create, join, move },
    },
  } = useDojo();

  const { player } = usePlayer({ playerId: account.address });
  const { game } = useGame({ gameId: player?.gameId });
  const { chaser } = useChaser({
    playerId: player?.id,
    gameId: player?.gameId,
  });
  const { chasers } = useChasers({ gameId: player?.gameId });

  const handleSignup = useCallback(
    async (name: string) => {
      await signup({ account, name });
    },
    [account],
  );

  const handleRename = useCallback(
    async (name: string) => {
      await rename({ account, name });
    },
    [account],
  );

  const handleCreate = useCallback(async () => {
    await create({ account });
  }, [account]);

  const handleJoin = useCallback(
    async (gameId: number) => {
      await join({ account, gameId });
    },
    [account],
  );

  const handleMove = useCallback(
    async (direction: number) => {
      await move({ account, direction });
    },
    [account],
  );

  const playerManager = useMemo(() => {
    return PlayerManager.getInstance();
  }, []);

  const gameManager = useMemo(() => {
    return GameManager.getInstance();
  }, []);

  useEffect(() => {
    playerManager.setSignup(handleSignup);
    playerManager.setRename(handleRename);
    playerManager.setPlayer(player);
  }, [playerManager, player, handleSignup]);

  useEffect(() => {
    gameManager.setCreate(handleCreate);
    gameManager.setJoin(handleJoin);
    gameManager.setMove(handleMove);
    gameManager.setGame(game);
    gameManager.setChaser(chaser);
    gameManager.setChasers(
      chasers.filter((c) => c.playerId !== chaser?.playerId),
    );
  }, [
    gameManager,
    game,
    chaser,
    chasers,
    handleCreate,
    handleJoin,
    handleMove,
  ]);
};
