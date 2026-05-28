import { useCallback } from "react";
import {
  Alert,
  Center,
  Container,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import BookCard from "@/components/books/BookCard";
import BookCardSkeleton from "@/components/books/BookCardSkeleton";
import BookSearchForm from "@/components/books/BookSearchForm";
import { useBookSearch } from "@/hooks/useBookSearch";
import { MIN_QUERY_LENGTH } from "@/lib/constants";
import { useReportsFilters } from "@/store/reportsFilters.store";
import type { SearchFilters } from "@/types/bigbook";

export default function ReportsPage() {
  const filters = useReportsFilters((s) => s.filters);
  const offset = useReportsFilters((s) => s.offset);
  const applyFilters = useReportsFilters((s) => s.applyFilters);
  const setOffset = useReportsFilters((s) => s.setOffset);

  const { books, total, pageSize, isLoading, error } = useBookSearch();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.floor(offset / pageSize) + 1;

  const handleSubmit = useCallback(
    (values: SearchFilters) => applyFilters(values),
    [applyFilters],
  );

  const handlePageChange = useCallback(
    (page: number) => setOffset((page - 1) * pageSize),
    [setOffset, pageSize],
  );

  const hasQuery = filters.query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={2}>Book Reports</Title>

        <BookSearchForm
          initialValues={filters}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
        />

        {error && (
          <Alert
            color="red"
            icon={<IconAlertCircle size={16} />}
            title="Failed to load books"
          >
            {error.message}
          </Alert>
        )}

        {isLoading && !error && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
            {Array.from({ length: pageSize }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </SimpleGrid>
        )}

        {!isLoading && !error && hasQuery && books.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No books match your search.
          </Text>
        )}

        {!isLoading && !hasQuery && (
          <Text c="dimmed" ta="center" py="xl">
            Enter at least {MIN_QUERY_LENGTH} characters and hit Search.
          </Text>
        )}

        {!isLoading && books.length > 0 && (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </SimpleGrid>

            {totalPages > 1 && (
              <Center>
                <Pagination
                  value={currentPage}
                  onChange={handlePageChange}
                  total={totalPages}
                />
              </Center>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
