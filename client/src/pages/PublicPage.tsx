import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Center, Container, Image, Loader, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { api } from "../api";
import type { Collection } from "../types";

// Read-only view of a public collection. Works without signing in.
export default function PublicPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => { api(`/public/${id}`).then(setCollection); }, [id]);

  if (!collection) return <Center py="xl"><Loader /></Center>;

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        <div>
          <Text size="sm" c="dimmed">Shared collection</Text>
          <Title order={2}>{collection.name}</Title>
        </div>
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }}>
          {collection.images.map((photo) => (
            <Card key={photo.id} withBorder padding="sm">
              <Card.Section><Image src={photo.url} h={160} loading="lazy" /></Card.Section>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
