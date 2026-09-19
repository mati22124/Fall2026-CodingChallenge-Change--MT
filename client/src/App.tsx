import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, type User } from "firebase/auth";
import { Anchor, Button, Center, Container, Group, Text } from "@mantine/core";
import { auth } from "./firebase";
import CollectionsPage from "./pages/CollectionsPage";
import SearchPage from "./pages/SearchPage";
import CollectionPage from "./pages/CollectionPage";
import PublicPage from "./pages/PublicPage";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Firebase calls setUser whenever someone signs in or out.
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  const signIn = () => signInWithPopup(auth, new GoogleAuthProvider());

  // Signed out: public collections are still viewable, everything else shows the sign-in button.
  if (!user) {
    return (
      <Routes>
        <Route path="/public/:id" element={<PublicPage />} />
        <Route path="*" element={<Center h="100vh"><Button onClick={signIn}>Sign in with Google</Button></Center>} />
      </Routes>
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
        <Route path="/public/:id" element={<PublicPage />} />
      </Routes>
    </Container>
  );
}
