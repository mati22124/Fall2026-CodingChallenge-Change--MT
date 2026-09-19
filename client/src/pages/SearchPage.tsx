import { useEffect, useState } from "react";
import { Button, Card, Group, Image, Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { api } from "../api";
import type { Collection, Photo } from "../types";

// Searches Pixabay and saves results into a chosen collection.
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [target, setTarget] = useState<string | null>(null); // id of the collection to save into

  useEffect(() => { api("/collections").then(setCollections); }, []);

  const search = () => api(`/search?q=${query}`).then(setResults);
  const save = (photo: Photo) => api(`/collections/${target}/images`, "POST", photo);

  return (
    <Stack>
      <Group>
        <TextInput placeholder="Search Pixabay" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button onClick={search}>Search</Button>
        <Select
          placeholder="Save to..."
          data={collections.map((c) => ({ value: c.id, label: c.name }))}
          value={target}
          onChange={setTarget}
        />
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        {results.map((photo) => (
          <Card key={photo.id} withBorder>
            <Card.Section><Image src={photo.url} h={160} loading="lazy" /></Card.Section>
            <Button mt="sm" size="xs" disabled={!target} onClick={() => save(photo)}>Save</Button>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
