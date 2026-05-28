import { useCallback, type ChangeEvent } from "react";
import {
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  RangeSlider,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import {
  MAX_PUBLISH_YEAR,
  MIN_PUBLISH_YEAR,
  MIN_QUERY_LENGTH,
} from "@/lib/constants";
import {
  GENRES,
  SORT_DIRECTIONS,
  SORT_KEYS,
  type BookSearchFormProps,
  type Genre,
  type SearchFilters,
  type SortDirection,
  type SortKey,
} from "@/types/bigbook";

const GENRE_OPTIONS = GENRES.map((g) => ({
  value: g,
  label: g.replace(/_/g, " "),
}));

const SORT_OPTIONS = SORT_KEYS.map((s) => ({ value: s, label: s }));
const DIRECTION_OPTIONS = SORT_DIRECTIONS.map((d) => ({
  value: d,
  label: d,
}));
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100].map((n) => ({
  value: String(n),
  label: String(n),
}));

const YEAR_MARKS = [
  { value: 1900, label: "1900" },
  { value: 1950, label: "1950" },
  { value: 2000, label: "2000" },
  { value: MAX_PUBLISH_YEAR, label: String(MAX_PUBLISH_YEAR) },
];

const RATING_MARKS = [
  { value: 0, label: "0" },
  { value: 0.5, label: "0.5" },
  { value: 1, label: "1" },
];

export default function BookSearchForm({
  initialValues,
  onSubmit,
  isSubmitting,
}: BookSearchFormProps) {
  const form = useForm<SearchFilters>({
    initialValues,
    validate: {
      query: (v) =>
        v.trim().length < MIN_QUERY_LENGTH
          ? `At least ${MIN_QUERY_LENGTH} characters`
          : null,
    },
  });

  // Pull stable setters off the form once so the named handlers below can
  // list narrow, stable deps instead of capturing the whole `form` object
  // (which may receive a new reference each render).
  const { setValues, setFieldValue } = form;

  // exhaustMap equivalent: short-circuit while a request is in flight, plus
  // the submit button is disabled — a double-click can't fire a second
  // request. SWR also dedupes identical keys.
  const handleValidSubmit = useCallback(
    (values: SearchFilters) => {
      if (isSubmitting) return;
      onSubmit(values);
    },
    [isSubmitting, onSubmit],
  );

  // Single setValues call keeps both slider thumbs in sync — calling
  // setFieldValue twice in a row can lose the second update during fast drags.
  const handleRatingChange = useCallback(
    ([minRating, maxRating]: number[]) =>
      setValues({ minRating, maxRating }),
    [setValues],
  );

  const handleYearChange = useCallback(
    ([earliestPublishYear, latestPublishYear]: number[]) =>
      setValues({ earliestPublishYear, latestPublishYear }),
    [setValues],
  );

  const handleGenresChange = useCallback(
    (value: string[]) => setFieldValue("genres", value as Genre[]),
    [setFieldValue],
  );

  const handleSortChange = useCallback(
    (value: string | null) =>
      setFieldValue("sort", (value as SortKey | null) ?? null),
    [setFieldValue],
  );

  const handleDirectionChange = useCallback(
    (value: string | null) => {
      if (value) setFieldValue("sortDirection", value as SortDirection);
    },
    [setFieldValue],
  );

  const handlePageSizeChange = useCallback(
    (value: string | null) => {
      if (value) setFieldValue("pageSize", Number(value));
    },
    [setFieldValue],
  );

  const handleGroupResultsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      setFieldValue("groupResults", e.currentTarget.checked),
    [setFieldValue],
  );

  const handleReset = useCallback(
    () => setValues(initialValues),
    [setValues, initialValues],
  );

  return (
    <Paper withBorder p="md" radius="md">
      <form onSubmit={form.onSubmit(handleValidSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Search query"
            placeholder="Title, keyword, topic..."
            leftSection={<IconSearch size={16} />}
            withAsterisk
            {...form.getInputProps("query")}
          />

          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Publish year range
              </Text>
              <Text size="xs" c="dimmed">
                {form.values.earliestPublishYear} –{" "}
                {form.values.latestPublishYear}
              </Text>
            </Group>
            <RangeSlider
              min={MIN_PUBLISH_YEAR}
              max={MAX_PUBLISH_YEAR}
              step={1}
              minRange={0}
              value={[
                form.values.earliestPublishYear,
                form.values.latestPublishYear,
              ]}
              onChange={handleYearChange}
              marks={YEAR_MARKS}
            />
          </Stack>

          <Stack gap={4}>
            <Group justify="space-between">
              <Text size="sm" fw={500}>
                Rating range
              </Text>
              <Text size="xs" c="dimmed">
                {form.values.minRating.toFixed(2)} –{" "}
                {form.values.maxRating.toFixed(2)}
              </Text>
            </Group>
            <RangeSlider
              min={0}
              max={1}
              step={0.05}
              minRange={0}
              value={[form.values.minRating, form.values.maxRating]}
              onChange={handleRatingChange}
              marks={RATING_MARKS}
            />
          </Stack>

          <MultiSelect
            label="Genres"
            placeholder="Any"
            data={GENRE_OPTIONS}
            value={form.values.genres}
            onChange={handleGenresChange}
            clearable
          />

          <TextInput
            label="Authors"
            placeholder="Comma-separated names or ids"
            {...form.getInputProps("authors")}
          />

          <Group grow align="flex-end">
            <Select
              label="Sort by"
              placeholder="Default"
              data={SORT_OPTIONS}
              value={form.values.sort}
              onChange={handleSortChange}
              clearable
            />
            <Select
              label="Direction"
              data={DIRECTION_OPTIONS}
              value={form.values.sortDirection}
              onChange={handleDirectionChange}
              disabled={!form.values.sort}
              allowDeselect={false}
            />
            <Select
              label="Results per page"
              data={PAGE_SIZE_OPTIONS}
              value={String(form.values.pageSize)}
              onChange={handlePageSizeChange}
              allowDeselect={false}
            />
          </Group>

          <Group justify="space-between" align="center">
            <Checkbox
              label="Group similar editions"
              checked={form.values.groupResults}
              onChange={handleGroupResultsChange}
            />
            <Group gap="sm">
              <Button
                type="button"
                variant="default"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                leftSection={<IconSearch size={16} />}
              >
                Search
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
