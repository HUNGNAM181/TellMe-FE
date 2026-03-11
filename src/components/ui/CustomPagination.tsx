import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  page,
  totalPages,
  onPageChange,
}: CustomPaginationProps) {
  const generatePagination = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1, totalPages, page, page - 1, page + 1];

    const sortedPages = Array.from(new Set(pages))
      .filter((p) => typeof p === "number" && p >= 1 && p <= totalPages)
      .sort((a, b) => (a as number) - (b as number));

    const result: (number | string)[] = [];
    let lastPage: number | null = null;

    for (const p of sortedPages) {
      const currentPage = p as number;
      if (lastPage !== null) {
        if (currentPage - lastPage === 2) {
          result.push(lastPage + 1);
        } else if (currentPage - lastPage > 2) {
          result.push("...");
        }
      }
      result.push(currentPage);
      lastPage = currentPage;
    }

    return result;
  };

  const pages = generatePagination();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="cursor-pointer"
            disabled={page === 1}
          />
        </PaginationItem>

        {pages.map((p, index) => (
          <PaginationItem key={index}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === p}
                onClick={() => onPageChange(p as number)}
                className={cn("cursor-pointer border", page === p && "bg-primary text-primary-foreground")}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="cursor-pointer"
            disabled={page >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
