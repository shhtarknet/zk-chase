import { useDojo } from "@/dojo/useDojo";
import { useEffect, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import { Has, HasValue, getComponentValue } from "@dojoengine/recs";
import { Chaser } from "@/dojo/models/chaser";

export const useChasers = ({
  gameId,
}: {
  gameId: number | undefined;
}): { chasers: Chaser[] } => {
  const [chasers, setChasers] = useState<any>({});

  const {
    setup: {
      clientModels: {
        Chaser,
        classes: { Chaser: ChaserClass },
      },
    },
  } = useDojo();

  const keys = useEntityQuery([
    Has(Chaser),
    HasValue(Chaser, { game_id: gameId || 0 }),
  ]);

  useEffect(() => {
    const components = keys.map((key) => {
      const component = getComponentValue(Chaser, key);
      if (!component) {
        return undefined;
      }
      return new ChaserClass(component);
    });

    const objectified = components.reduce(
      (obj: any, chaser: Chaser | undefined) => {
        if (chaser) {
          obj[`${chaser.playerId}-${chaser.gameId}`] = chaser;
        }
        return obj;
      },
      {},
    );

    setChasers(objectified);
  }, [keys]);

  return { chasers: Object.values(chasers) };
};
