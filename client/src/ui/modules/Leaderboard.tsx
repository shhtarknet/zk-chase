import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/elements/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/elements/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkullCrossbones, faStar } from "@fortawesome/free-solid-svg-icons";
import { usePlayer } from "@/hooks/usePlayer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChasers } from "@/hooks/useChasers";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Chaser } from "@/dojo/models/chaser";

const CHASER_PER_PAGE = 5;
const MAX_PAGE_COUNT = 5;

export const Leaderboard = () => {
  const { gameId } = useQueryParams();
  const { chasers } = useChasers({ gameId });
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);

  const sorteds = useMemo(() => {
    return chasers
      .sort((a, b) => b.killCount - a.killCount)
      .sort((a, b) => b.treasuryCount - a.treasuryCount);
  }, [chasers]);

  useEffect(() => {
    const rem = Math.floor(sorteds.length / (CHASER_PER_PAGE + 1)) + 1;
    setPageCount(rem);
  }, [sorteds]);

  const { start, end } = useMemo(() => {
    const start = (page - 1) * CHASER_PER_PAGE;
    const end = start + CHASER_PER_PAGE;
    return { start, end };
  }, [page]);

  const handlePrevious = useCallback(() => {
    if (page === 1) return;
    setPage((prev) => prev - 1);
  }, [page]);

  const handleNext = useCallback(() => {
    if (page === Math.min(pageCount, MAX_PAGE_COUNT)) return;
    setPage((prev) => prev + 1);
  }, [page, pageCount]);

  const disabled = useMemo(() => sorteds.length > 0, [sorteds]);

  return (
    <div className="bg-black bg-opacity-50 p-4 rounded-xl">
      <Table className="text-xl">
        <TableCaption className={`${disabled && "hidden"}`}>
          Leaderbord is waiting for its best chasers to make history
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-1/5">Rank</TableHead>
            <TableHead className="text-center w-1/5">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            </TableHead>
            <TableHead className="text-center w-1/5">
              <FontAwesomeIcon
                icon={faSkullCrossbones}
                className="text-slate-500"
              />
            </TableHead>
            <TableHead className="w-3/5">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorteds.slice(start, end).map((chaser, index) => (
            <Row
              key={index}
              rank={(page - 1) * CHASER_PER_PAGE + index + 1}
              chaser={chaser}
            />
          ))}
        </TableBody>
      </Table>
      <Pagination className={`${!disabled && "hidden"}`}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`${page === 1 && "opacity-50"}`}
              onClick={handlePrevious}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={`${page === Math.min(pageCount, MAX_PAGE_COUNT) && "opacity-50"}`}
              onClick={handleNext}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export const Row = ({ rank, chaser }: { rank: number; chaser: Chaser }) => {
  const { player } = usePlayer({ playerId: chaser.playerId });

  return (
    <TableRow>
      <TableCell>{`# ${rank}`}</TableCell>
      <TableCell className="text-right">
        <p className="flex gap-1 justify-center items-center">
          <span className="font-bold">{chaser.treasuryCount}</span>
        </p>
      </TableCell>
      <TableCell className="text-right">
        <p className="flex gap-1 justify-center items-center">
          <span className="font-bold">{chaser.killCount}</span>
        </p>
      </TableCell>
      <TableCell className="text-left max-w-36 truncate">
        {player?.name || "-"}
      </TableCell>
    </TableRow>
  );
};
