import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const query = sp.q ?? "";
  const page = Number(sp.page ?? "1");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", query, page],
    queryFn: () => fetchNotes(query, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialQuery={query} initialPage={page} />
    </HydrationBoundary>
  );
}
