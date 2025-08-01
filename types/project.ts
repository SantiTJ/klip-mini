export interface Project {
  id?: string; // lo añade Firestore automáticamente
  name: string;
  description?: string;
  fileUrl: string;
  userId: string;
  createdAt: number;
}
