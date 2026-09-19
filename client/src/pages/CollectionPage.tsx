import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Card, Group, Image, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { api } from "../api";
import type { Collection } from "../types";

// Shows one collection: its images, remove buttons, sharing, and delete.
export default function CollectionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [email, setEmail] = useState("");

  const load = () => api(`/collections/${id}`).then(setCollection);
  useEffect(() => { load(); }, [id]);

  // Optimistic: update the screen right away, then tell the server.
  const remove = (imageId: number) => {
    setCollection((c) => c && { ...c, images: c.images.filter((p) => p.id !== imageId) });
    api(`/collections/${id}/images/${imageId}`, "DELETE");
  };

  const share = async () => {
    await api(`/collections/${id}/share`, "POST", { email });
    setEmail("");
    load();
  };

  const deleteCollection = async () => {
    await api(`/collections/${id}`, "DELETE");
    navigate("/");
  };

  const togglePublic = async () => {
    await api(`/collections/${id}`, "PATCH", { isPublic: !collection?.isPublic });
    load();
  };

  if (!collection) return null;

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>{collection.name}</Title>
        <Group>
          <Button variant="light" onClick={togglePublic}>{collection.isPublic ? "Make private" : "Make public"}</Button>
          <Button color="red" variant="light" onClick={deleteCollection}>Delete collection</Button>
        </Group>
      </Group>
      {collection.isPublic && <Text size="sm">Public link: {window.location.origin}/public/{id}</Text>}
      <Group>
        <TextInput placeholder="Share with email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={share}>Share</Button>
        <Text size="sm" c="dimmed">Members: {collection.members.join(", ")}</Text>
      </Group>
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        {collection.images.map((photo) => (
          <Card key={photo.id} withBorder>
            <Card.Section><Image src={photo.url} h={160} loading="lazy" /></Card.Section>
            <Button mt="sm" size="xs" color="red" variant="light" onClick={() => remove(photo.id)}>Remove</Button>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
