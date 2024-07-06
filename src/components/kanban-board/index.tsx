/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import ColumnContainer from "@/ui/components/drag-drop/ColumnContainer";
import {
  Active,
  DataRef,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  DragStartEvent,
  Over,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
// import RichTextEditor from "@/components/rich-text-editor";
import { api } from "@/utils/api";
import { type Status } from "@/components/kanban-board/types";

import { Chip, Drawer, MultiSelect } from "@mantine/core";

import { useRouter } from "next/router";
import { ComboboxPopover } from "../popover/popover-search";

import { useDisclosure } from "@mantine/hooks";
import { type Task } from "@prisma/client";
// import ColumnContainer from "./ColumnContainer";
import DescriptionRichTextEditorComponent from "@/components/rich-text-editor/description-text-editor";
import { toast } from "sonner";
import { StatusSelectType } from "@/types";
import { BoardContainer, ColumnContainer } from "./ColumnContainer";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const column = [
  {
    value: "TO_DO",
    label: "To Do",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "ISSUES",
    label: "Issues",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
];

function KanbanBoard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [userDetails, setUserDetails] = useState([]);
  const [assignee, setAssignee] = useState<Status | undefined>();
  const [collaborators, setCollaborators] = useState<Status[] | undefined>([]);
  const [taskId, setTaskId] = useState("");
  const [singleTitle, setSingleTask] = useState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [cardId, setCardId] = useState<string>("");
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [columns, setColumns] = useState(
    [] as {
      value: string;
      label: string;
    }[],
  );
  const [allProjects, setAllProjects] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState<StatusSelectType>();

  const [singleRequestData, setSingleRequestData] = useState(
    {} as typeof getSingleRequest,
  );
  const [updatedTasks, setUpdatedTasks] = useState({} as Task);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsId = useMemo(() => column.map((col) => col.value), [column]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const router = useRouter();

  const { data: allUsers } = api.user.allUsers.useQuery();
  const { data: descriptionData, mutate: getSingleDescription } =
    api.task.getSingleDescription.useMutation({});

  const { data: getAllTasks, refetch: refetchAllTasks } =
    api.task.getAllTasks.useQuery();
  const { data: allProject } = api.project.allProjects.useQuery();

  const { data: getAllStatus, refetch } =
    api.status.getAllStatusForUser.useQuery();

  const { data: getSingleRequest, refetch: refetchSingleRequest } =
    api.task.getSingleTask.useQuery(
      {
        id: cardId,
      },
      {
        enabled: cardId !== "",
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        staleTime: 1 * 10,
      },
    );

  const { mutate: connectToTask } = api.project.connectTask.useMutation({
    onSuccess() {
      toast.success("Task Connected");
    },
  });
  const handleTaskConnect = (value: string[]) => {
    connectToTask({
      projectId: value,
      taskId: taskId,
    });
  };

  const { mutate: updateStatus } = api.task.updateStatus.useMutation({
    onSuccess() {
      toast.success("Status updated");

      void refetchAllTasks();
    },
  });

  const { mutate: getSingleTaskComments, data: getSingleTaskCommentsData } =
    api.task.getSingleTaskComments.useMutation({});

  const { mutate: addAssigned } = api.task.updateAssignee.useMutation({});
  const { mutate: fetchSingleCollaborator } =
    api.task.getSingleTaskCollaborators.useMutation({
      onSuccess(value) {
        if (value) {
          const collaboratorsData = value?.collaborators?.map((crmList) => {
            return {
              label: crmList.name,
              value: crmList.id,
              icon: crmList.image,
            };
          });
          console.log(collaboratorsData, "collaboratorsData");
          setCollaborators(collaboratorsData as []);
        }
      },
    });

  const { mutate: addCollaborators } =
    api.task.addOrUpdateCollaborators.useMutation({
      onSuccess() {
        fetchSingleCollaborator({
          taskId: router.query.id as string,
        });
      },
    });

  const handleUpdateStatusFu = ({
    id,
    status,
  }: {
    id: string;
    status: "TO_DO" | "IN_PROGRESS" | "ISSUES" | "COMPLETED" | "OVERDUE";
  }) => {
    updateStatus({
      id: id,
      status: status,
    });
  };

  const fetchSingleTask = (id: string) => {
    setCardId(id);
    setToggleSidebar(true);

    void router.push({
      query: { id: id },
    });
  };

  const fetchComment = (id: string) => {
    getSingleTaskComments({
      id: id,
    });
  };
  const fetchDescription = (id: string) => {
    getSingleDescription({
      taskId: id,
    });
  };

  useEffect(() => {
    if (getAllStatus) {
      setColumns(getAllStatus);
    }
  }, [getAllStatus]);
  useEffect(() => {
    if (getAllTasks) {
      setTasks(getAllTasks);
    }
  }, [getAllTasks]);

  useEffect(() => {
    if (getSingleRequest) {
      setSingleRequestData(getSingleRequest);
      setSelectedStatus(
        columns.find((priority) => priority.value === getSingleRequest.status),
      );
    }
  }, [getSingleRequest, cardId, columns]);

  useMemo(() => {
    if (allUsers && allUsers?.length > 0) {
      const data = allUsers?.map((crmList) => {
        return {
          label: crmList.name,
          value: crmList.id,
          icon: crmList.image,
        };
      });
      setUserDetails(data as []);
    }
  }, [allUsers]);

  useMemo(() => {
    if (allProject && allProject?.length > 0) {
      const data = allProject?.map((crmList) => {
        return {
          label: crmList.name,
          value: crmList.id,
        };
      });
      setAllProjects(data as []);
    }
  }, [allProject]);
  const handleAssignee = (label: string) => {
    addAssigned({
      assigned_to: label,
      taskId: taskId,
    });
  };

  const handleCollaborators = useCallback(
    (value: string[]) => {
      if (value) {
        addCollaborators({
          collaborators: value,
          taskId: taskId,
        });
      }
    },
    [addCollaborators, taskId],
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (updatedTasks.id) {
      void updateStatus({
        id: updatedTasks.id,
        status: updatedTasks.status as
          | "IN_PROGRESS"
          | "TO_DO"
          | "ISSUES"
          | "COMPLETED",
      });
    }
    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks?.findIndex((t) => t.id === activeId);
        const overIndex = tasks?.findIndex((t) => t.id === overId);
        //@ts-ignore

        if (tasks[activeIndex].status != tasks[overIndex].status) {
          //@ts-ignore

          tasks[activeIndex].status = tasks[overIndex].status;
          //@ts-ignore
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        //@ts-ignore
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks?.findIndex((t) => t.id === activeId);
        //@ts-ignore
        tasks[activeIndex].status = overId;

        // console.log("DROPPING TASK OVER COLUMN", tasks);
        //@ts-ignore
        setUpdatedTasks(tasks[activeIndex]);

        //@ts-ignore
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    // if (data?.type === "Column") {
    //   setActiveColumn(data.column);
    //   return;
    // }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  return (
    <div>
      
    </div>
  );
}

export default KanbanBoard;

function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}
