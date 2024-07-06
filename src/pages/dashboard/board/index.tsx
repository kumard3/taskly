/* eslint-disable @typescript-eslint/no-misused-promises */
import { MainLayout } from "@/components/layouts/main-layout";
import KanbanBoard from "@/components/kanban-board";

export default function Home() {
  return (
    <MainLayout>
      <KanbanBoard />
    </MainLayout>
  );
}
