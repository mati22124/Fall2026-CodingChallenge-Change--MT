import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Group, Image, Select, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { api } from "../api";
import type { Collection, Photo } from "../types";

// Searches Pixabay and saves results into a chosen collection.
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [target, setTarget] = useState<string | null>(null); // id of the collection to save into
  const [savedIds, setSavedIds] = useState<number[]>([]); // images saved during this visit

  useEffect(() => { api("/collections").then(setCollections); }, []);

  const search = (e: FormEvent) => {
    e.preventDefault(); // keep the browser from reloading the page on submit
    api(`/search?q=${query}`).then(setResults);
  };

  const save = async (photo: Photo) => {
    await api(`/collections/${target}/images`, "POST", photo);
    setSavedIds([...savedIds, photo.id]);
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Search</Title>
      <form onSubmit={search}>
        <Group>
          <TextInput placeholder="Search Pixabay" value={query} onChange={(e) => setQuery(e.target.value)} flex={1} />
          <Button type="submit">Search</Button>
          <Select
            placeholder="Save to..."
            data={collections.map((c) => ({ value: c.id, label: c.name }))}
            value={target}
            onChange={setTarget}
          />
        </Group>
      </form>
      {results.length === 0 && <Text c="dimmed">Search for something, pick a collection, then save what you like.</Text>}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }}>
        {results.map((photo) => {
          const saved = savedIds.includes(photo.id);
          return (
            <Card key={photo.id} withBorder padding="sm">
              <Card.Section><Image src={photo.url} h={160} loading="lazy" /></Card.Section>
              <Button mt="sm" size="xs" variant={saved ? "light" : "filled"} disabled={!target || saved} onClick={() => save(photo)}>
                {saved ? "Saved" : "Save"}
              </Button>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
