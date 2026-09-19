import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Badge, Button, Card, Group, Image, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { api } from "../api";
import type { Collection } from "../types";

// Lists the user's collections and lets them create a new one.
export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [name, setName] = useState("");

  const load = () => api("/collections").then(setCollections);
  useEffect(() => { load(); }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault(); // keep the browser from reloading the page on submit
    await api("/collections", "POST", { name });
    setName("");
    load();
  };

  return (
    <Stack gap="lg">
      <Title order={2}>My collections</Title>
      <form onSubmit={create}>
        <Group>
          <TextInput placeholder="New collection name" value={name} onChange={(e) => setName(e.target.value)} flex={1} />
          <Button type="submit" disabled={!name}>Create</Button>
        </Group>
      </form>
      {collections.length === 0 && <Text c="dimmed">No collections yet. Create one above.</Text>}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
        {collections.map((c) => (
          <Card key={c.id} component={Link} to={`/collections/${c.id}`} withBorder shadow="sm">
            <Card.Section h={160} bg="gray.1">
              {c.images[0] && <Image src={c.images[0].url} h={160} loading="lazy" />}
            </Card.Section>
            <Group justify="space-between" mt="sm">
              <Text fw={500}>{c.name}</Text>
              {c.isPublic && <Badge variant="light" color="green">Public</Badge>}
            </Group>
            <Text size="sm" c="dimmed">{c.images.length} images</Text>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
