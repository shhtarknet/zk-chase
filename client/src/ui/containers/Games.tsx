import { useGames } from "@/hooks/useGames";
import { Join } from "@/ui/actions/Join";
import { Carousel, CarouselContent } from "@/ui/elements/carousel";
import { Create } from "../actions/Create";

export const Games = () => {
  const { games } = useGames();

  return (
    <div className="flex flex-col items-stretch gap-4">
      <Create />
      <Carousel
        opts={{ align: "start", dragFree: true }}
        orientation="vertical"
        className="w-full"
      >
        <CarouselContent className="flex gap-4 my-4 h-[500px]">
          {games.reverse().map((game, key) => (
            <div
              className="px-4 py-2 flex justify-between items-center border border-white"
              key={key}
            >
              {`#${game.id}`}
              <Join gameId={game.id} />
            </div>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
