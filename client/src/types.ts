// Shapes of the JSON the backend sends. Mirrors the Firestore document layout.

export interface Photo {
  id: number;
  url: string;
  tags: string;
}

export interface Collection {
  id: string;
  name: string;
  members: string[];
  images: Photo[];
  isPublic: boolean;
}
