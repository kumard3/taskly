import { Task, Comment } from "@prisma/client";
import { HTMLAttributes } from "react";

export type StatusSelectType = {
  value: string;
  label: string;
};

export const StatusesSelect: StatusSelectType[] = [
  {
    value: "TO_DO",
    label: "Todo",
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

export type Status = {
  label: string;
  value: string;
  icon: string | null;
};
export type classNameProps = {
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

// type CombinedType = TypeA & TypeB;

// export type Tasks = Task & Comment;

export interface Tasks extends Task {
  comment: Comment[];
}
