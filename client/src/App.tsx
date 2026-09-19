import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, type User } from "firebase/auth";
import { AppShell, Button, Center, Container, Group, Stack, Text, Title, useMantineColorScheme } from "@mantine/core";
import { auth } from "./firebase";
import CollectionsPage from "./pages/CollectionsPage";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import PublicPage from "./pages/PublicPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme(); // Mantine remembers the choice in localStorage

  // Firebase calls setUser whenever someone signs in or out.
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());

  // Signed out: public collections are still viewable, everything else shows the sign-in screen.
  if (!user) {
    return (
      <Routes>
        <Route path="/public/:id" element={<PublicPage />} />
        <Route
          path="*"
          element={
            <Center h="100vh">
              <Stack align="center">
                <Title>Collections</Title>
                <Text c="dimmed">Save and share the images you love.</Text>
                <Button onClick={signIn}>Sign in with Google</Button>
              </Stack>
            </Center>
          }
        />
      </Routes>
    );
  }

  // Signed in: a fixed header bar with nav, and the current page below it.
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between">
          <Group gap="xs">
            <Title order={4} mr="sm">Collections</Title>
            <Button variant="subtle" component={Link} to="/">Home</Button>
            <Button variant="subtle" component={Link} to="/search">Search</Button>
          </Group>
          <Group>
            <Text size="sm" c="dimmed">{user.email}</Text>
            <Button variant="default" size="xs" onClick={toggleColorScheme}>{colorScheme === "dark" ? "Light" : "Dark"}</Button>
            <Button variant="default" size="xs" onClick={() => signOut(auth)}>Sign out</Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="lg" py="md">
          <Routes>
            <Route path="/" element={<CollectionsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collections/:id" element={<CollectionPage />} />
            <Route path="/public/:id" element={<PublicPage />} />
          </Routes>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
