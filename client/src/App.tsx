import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider, type User } from "firebase/auth";
import { Button, Center, Container, Group, Text } from "@mantine/core";
import { auth } from "./firebase";

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
        <Text>{user.email}</Text>
        <Button variant="subtle" onClick={() => signOut(auth)}>Sign out</Button>
      </Group>
      <Routes>
        <Route path="/" element={<Text>Collections go here</Text>} />
      </Routes>
    </Container>
  );
}
