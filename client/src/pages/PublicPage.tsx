import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Container, Image, SimpleGrid, Stack, Title } from "@mantine/core";
import { api } from "../api";
import type { Collection } from "../types";

// Read-only view of a public collection. Works without signing in.
export default function PublicPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => { api(`/public/${id}`).then(setCollection); }, [id]);

  if (!collection) return null;

  return (
    <Container py="md">
      <Stack>
        <Title order={2}>{collection.name}</Title>
        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          {collection.images.map((photo) => (
            <Card key={photo.id} withBorder>
              <Card.Section><Image src={photo.url} h={160} loading="lazy" /></Card.Section>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
