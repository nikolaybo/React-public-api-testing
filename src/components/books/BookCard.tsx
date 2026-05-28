import { Badge, Box, Card, Group, Image, Stack, Text } from "@mantine/core";
import type { BookCardProps } from "@/types/bigbook";

export default function BookCard({ book }: BookCardProps) {
  const authors = book.authors.map((a) => a.name).join(", ") || "Unknown";
  const rating = book.rating != null ? book.rating.toFixed(2) : null;
  const primaryGenre = book.genres?.[0];

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      h="100%"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Card.Section>
        <Box pos="relative">
          <Image
            src={book.image ?? undefined}
            h={220}
            alt={book.title}
            fallbackSrc="https://placehold.co/200x300?text=No+cover"
          />
          {primaryGenre && (
            <Badge
              pos="absolute"
              top={8}
              left={8}
              variant="filled"
              color="blue"
              tt="capitalize"
            >
              {primaryGenre.replace(/_/g, " ")}
            </Badge>
          )}
        </Box>
      </Card.Section>

      <Stack flex={1} gap={4} mt="sm">
        <Text fw={600} lineClamp={2}>
          {book.title}
        </Text>
        <Text size="sm" c="dimmed" lineClamp={1}>
          {authors}
        </Text>
        {book.publish_year != null && (
          <Text size="xs" c="dimmed">
            Published {book.publish_year}
          </Text>
        )}
        {rating && (
          <Group gap={4} mt="auto" pt="xs">
            <Badge variant="light" color="blue">
              ★ {rating}
            </Badge>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
