import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { type Column } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
// import { TaskCard } from "../molecules/request/single-request-page/TaskCard";
import { Card, CardContent, CardHeader } from "../ui/card";
import { buttonVariants } from "../ui/button";
import { useDndContext } from "@dnd-kit/core";
import { cva } from "class-variance-authority";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import TaskCard from "./TaskCard";
import { Task } from "@prisma/client";

interface Props {
  column: Column;
  tasks: Task[];
  fetchSingleTask: (id: string) => void;
  isOverlay?: boolean;
}

export function ColumnContainer({
  column,
  tasks,
  fetchSingleTask,
  isOverlay,
}: Props) {
  // const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks?.map((task) => task?.id);
  }, [tasks]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column?.value as string,
    data: {
      type: "Column",
      column,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const variants = cva(
    "h-[calc(100svh-300px)] max-h-[calc(100svh-300px)] w-[350px] max-w-full  flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    },
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="space-between flex flex-row items-center border-b-2 p-4 text-left font-semibold">
        <p>{column.label}</p>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {tasks?.map((task) => (
              <TaskCard
                fetchSingleTask={fetchSingleTask}
                key={task.id}
                task={task}
              />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex flex-row items-center justify-center gap-4">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
