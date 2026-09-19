import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button, Card, Group, Image, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { api } from "../api";
import type { Collection } from "../types";

// Lists the user's collections and lets them create a new one.
export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [name, setName] = useState("");

  const load = () => api("/collections").then(setCollections);
  useEffect(() => { load(); }, []);

  const create = async () => {
    await api("/collections", "POST", { name });
    setName("");
    load();
  };

  return (
    <Stack>
      <Group>
        <TextInput placeholder="New collection name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={create}>Create</Button>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {collections.map((c) => (
          <Card key={c.id} component={Link} to={`/collections/${c.id}`} withBorder>
            <Card.Section><Image src={c.images[0]?.url} h={160} /></Card.Section>
            <Text fw={500} mt="sm">{c.name}</Text>
            <Text size="sm" c="dimmed">{c.images.length} images</Text>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
