import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, type User } from "firebase/auth";
import { Anchor, Button, Center, Container, Group, Text } from "@mantine/core";
import { auth } from "./firebase";
import CollectionsPage from "./pages/CollectionsPage";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Firebase calls setUser whenever someone signs in or out.
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (!user) {
    return (
      <Center h="100vh">
        <Button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>Sign in with Google</Button>
      </Center>
    );
  }

  return (
    <Container py="md">
      <Group justify="space-between" mb="lg">
        <Group>
          <Anchor component={Link} to="/">Collections</Anchor>
          <Anchor component={Link} to="/search">Search</Anchor>
        </Group>
        <Group>
          <Text>{user.email}</Text>
          <Button variant="subtle" onClick={() => signOut(auth)}>Sign out</Button>
        </Group>
      </Group>
      <Routes>
        <Route path="/" element={<CollectionsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/collections/:id" element={<CollectionPage />} />
      </Routes>
    </Container>
  );
}
