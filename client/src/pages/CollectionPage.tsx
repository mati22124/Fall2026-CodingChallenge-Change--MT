import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Badge, Button, Card, Center, CopyButton, Group, Image, Loader, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { api } from "../api";
import type { Collection } from "../types";

// Shows one collection: its images, remove buttons, sharing, public toggle, and delete.
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

  if (!collection) return <Center py="xl"><Loader /></Center>;

  const publicUrl = `${window.location.origin}/public/${id}`;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Group gap="sm">
          <Title order={2}>{collection.name}</Title>
          <Badge variant="light" color={collection.isPublic ? "green" : "gray"}>
            {collection.isPublic ? "Public" : "Private"}
          </Badge>
        </Group>
        <Group>
          <Button variant="default" onClick={togglePublic}>{collection.isPublic ? "Make private" : "Make public"}</Button>
          <Button variant="light" color="red" onClick={deleteCollection}>Delete</Button>
        </Group>
      </Group>

      {collection.isPublic && (
        <Group gap="xs">
          <Text size="sm" c="dimmed">{publicUrl}</Text>
          <CopyButton value={publicUrl}>
            {({ copied, copy }) => <Button size="xs" variant="light" onClick={copy}>{copied ? "Copied" : "Copy link"}</Button>}
          </CopyButton>
        </Group>
      )}

      <Group>
        <TextInput placeholder="Share with an email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={share} disabled={!email}>Share</Button>
        {collection.members.map((m) => <Badge key={m} variant="outline" color="gray">{m}</Badge>)}
      </Group>

      {collection.images.length === 0 && <Text c="dimmed">No images yet. Head to Search to add some.</Text>}
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }}>
        {collection.images.map((photo) => (
          <Card key={photo.id} withBorder padding="sm">
            <Card.Section><Image src={photo.url} h={160} loading="lazy" /></Card.Section>
            <Button mt="sm" size="xs" variant="subtle" color="red" onClick={() => remove(photo.id)}>Remove</Button>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
