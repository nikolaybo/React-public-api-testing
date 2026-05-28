import { Card, Skeleton, Stack } from "@mantine/core";

export default function BookCardSkeleton() {
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
        <Skeleton height={220} radius={0} />
      </Card.Section>

      <Stack flex={1} gap={8} mt="sm">
        <Skeleton height={16} width="85%" />
        <Skeleton height={12} width="60%" />
        <Skeleton height={20} width={60} radius="xl" mt="auto" />
      </Stack>
    </Card>
  );
}
