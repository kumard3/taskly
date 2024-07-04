export type Id = string | number;

export type Column = {
  id?: Id;
  title?: string;
  value?: string;
  label?: string;
};

export type Task = {
  department: string;
  status: string | null;
  id: string;
  notes: string | null;
  projectTitle: string;
  priority: string;
  assigned_to: string | null;
  projectObjective: string | null;
  initials: string;
  comments: [];
  title: string;
};

// export type Task = {
//   id: Id;
//   status: Id;
//   content: string;
// };

export type ListItem = {
  department: string;
  status: string | null;
  id: string;
  notes: string | null;
  projectTitle: string;
  priority: string;
  assigned_to: string | null;
};

export type Status = {
  value: string;
  label: string;
  icon: string;
};
