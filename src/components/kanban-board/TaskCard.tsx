/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { truncateText } from "@/lib/truncateText";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuGripVertical } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { type Task } from "@prisma/client";
interface Props {
  task: Task | undefined;
  fetchSingleTask: (id: string) => void;
  isOverlay?: boolean;
}

function TaskCard({ task, fetchSingleTask, isOverlay }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task?.id as string,
    data: {
      type: "Task",
      task,
    },
    disabled: false,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })}
      >
        <CardHeader className="space-between relative flex h-full w-full flex-row items-center justify-between space-y-0 border-b-2 border-secondary  px-3 py-0">
          <Button
            variant={"ghost"}
            className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
            tabIndex={2}
          >
            <span className="sr-only">Move task</span>
            <LuGripVertical />
          </Button>
          <div
            className="flex h-full w-full cursor-pointer items-center justify-between py-3.5"
            onClick={() => {
              fetchSingleTask(task?.id as string);
            }}
          >
            <p className=" text-black-1 text-sm font-semibold">
              {truncateText(task?.title as string, 60)}
            </p>
            <Badge variant={"outline"} className="ml-auto font-semibold">
              Task
            </Badge>
          </div>
        </CardHeader>
        <CardContent
          onClick={() => {
            fetchSingleTask(task?.id as string);
          }}
          className="cursor-pointer whitespace-pre-wrap  px-3 pb-6 pt-3 text-left"
        >
          <p className="text-black-1 h-8 truncate text-xs font-semibold">
            {task?.description}
          </p>
        </CardContent>
        <CardFooter
          onClick={() => {
            fetchSingleTask(task?.id as string);
          }}
          className="cursor-pointer"
        >
          <div className="flex w-full items-center justify-between">
            <p className="rounded-full bg-[#309DF4] p-1 px-2 text-xs text-white">
              {task?.initials?.charAt(0)}
            </p>
            <div className="flex gap-1">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.4999 8.05156H8.0499C8.24345 8.05156 8.3999 7.89476 8.3999 7.70156C8.3999 7.50836 8.24345 7.35156 8.0499 7.35156H3.4999C3.30635 7.35156 3.1499 7.50836 3.1499 7.70156C3.1499 7.89476 3.30635 8.05156 3.4999 8.05156Z"
                  fill="#000"
                />
                <path
                  d="M12.5999 9.45312H3.4999C3.30635 9.45312 3.1499 9.60993 3.1499 9.80312C3.1499 9.99632 3.30635 10.1531 3.4999 10.1531H12.5999C12.7935 10.1531 12.9499 9.99632 12.9499 9.80312C12.9499 9.60993 12.7935 9.45312 12.5999 9.45312Z"
                  fill="#000"
                />
                <path
                  d="M12.5999 11.5469H3.4999C3.30635 11.5469 3.1499 11.7037 3.1499 11.8969C3.1499 12.0901 3.30635 12.2469 3.4999 12.2469H12.5999C12.7935 12.2469 12.9499 12.0901 12.9499 11.8969C12.9499 11.7037 12.7935 11.5469 12.5999 11.5469Z"
                  fill="#000"
                />
                <path
                  d="M18.9252 0.0245001L6.9755 0C5.831 0 4.9 0.931 4.9 2.0755V3.8689L2.0755 3.87485C0.931 3.87485 0 4.80585 0 5.95035V13.3497C0 14.4942 0.931 15.4248 2.0755 15.4248H4.2V18.9248C4.2 19.0694 4.2889 19.1993 4.424 19.2514C4.46495 19.2672 4.50765 19.2748 4.55 19.2748C4.6466 19.2748 4.74145 19.2346 4.809 19.1604L8.2054 15.4241L14.0245 15.4003C15.169 15.4003 16.1 14.4693 16.1 13.3252V13.2856L17.941 15.3107C18.0085 15.3849 18.1034 15.4252 18.2 15.4252C18.2423 15.4252 18.285 15.4175 18.326 15.4018C18.4611 15.3496 18.55 15.2197 18.55 15.0752V11.5752H18.9245C20.069 11.5752 21 10.6442 21 9.50005V2.1C21 0.95585 20.0693 0.0248501 18.9252 0.0245001ZM15.4 13.3248C15.4 14.0833 14.783 14.7 14.0231 14.7L8.0486 14.7245C7.9506 14.7248 7.8568 14.7665 7.791 14.8389L4.9 18.0194V15.0745C4.9 14.8813 4.74355 14.7245 4.55 14.7245H2.0755C1.31705 14.7245 0.7 14.1074 0.7 13.3493V5.95C0.7 5.19155 1.31705 4.5745 2.0762 4.5745L5.25 4.56785C5.25035 4.56785 5.25035 4.56785 5.2507 4.56785L14.0245 4.54965C14.7829 4.54965 15.4 5.1667 15.4 5.92515V12.3795V13.3248ZM20.3 9.49935C20.3 10.2578 19.6829 10.8745 18.9245 10.8745H18.2C18.0065 10.8745 17.85 11.0313 17.85 11.2245V14.1694L16.1 12.2444V5.9255C16.1 4.781 15.169 3.85 14.0238 3.85L5.6 3.86715V2.07515C5.6 1.3167 6.21705 0.69965 6.9748 0.69965L18.9242 0.72415C18.9245 0.72415 18.9245 0.72415 18.9248 0.72415C19.6833 0.72415 20.3004 1.3412 20.3004 2.09965L20.3 9.49935Z"
                  fill="#000"
                />
              </svg>
              {/* <p className="text-xs text-black">{task?.comments?.length}</p> */}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default TaskCard;
