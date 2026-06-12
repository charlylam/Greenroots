'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProjectPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ProjectPagination({
  currentPage,
  totalPages,
}: ProjectPaginationProps) {
  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? `#` : `/projets?page=${currentPage - 1}`}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`/projets?page=${page}`}
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
                ? `#`
                : `/projets?page=${currentPage + 1}`
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
