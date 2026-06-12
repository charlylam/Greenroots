'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TreesPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function TreesPagination({
  currentPage,
  totalPages,
}: TreesPaginationProps) {
  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? '#' : `/arbres?page=${currentPage - 1}`}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`/arbres?page=${page}`}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage === totalPages
                ? '#'
                : `/arbres?page=${currentPage + 1}`
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
