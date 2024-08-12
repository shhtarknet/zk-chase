import { useDojo } from "@/dojo/useDojo";
import { useMemo } from "react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";

export const useChaser = ({
  playerId,
  gameId,
}: {
  playerId: string | undefined;
  gameId: number | undefined;
}) => {
  const {
    setup: {
      clientModels: {
        Chaser,
        classes: { Chaser: ChaserClass },
      },
    },
  } = useDojo();

  const key = useMemo(
    () =>
      getEntityIdFromKeys([
        BigInt(playerId || 0),
        BigInt(gameId || 0),
      ]) as Entity,
    [playerId, gameId],
  );
  const component = useComponentValue(Chaser, key);
  const chaser = useMemo(() => {
    return component ? new ChaserClass(component) : null;
  }, [component]);
  return { chaser, key };
};
