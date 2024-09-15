import type { IPAllTaskData, IPAllUserData } from '@/types/projects'
import { create } from 'zustand'

export const useWorkSpaceStore = create<IPWorkspaceSwitcherProps>((set) => ({
  data: [],
  setWorkSpaceData: (data) => set({ data: data }),
  selectedWorkSpace: undefined,
  setSelectedWorkSpace: (data) => set({ selectedWorkSpace: data }),
}))

export const useTaskStore = create<IPTaskStoreProps>((set) => ({
  allUsers: { data: [], allData: [] },
  allTask: [],
  status: [],
  taskId: null,
  toggleSidebar: false,
  toggleUpdateTask: false,
  refetchAllTask: null, // Initial state
  refetchAllUsers: null, // Initial state
  refetchStatus: null, // Initial state
  refetchCustomLabels: null, // Initial state

  setRefetchAllTask: (refetchFn) => set({ refetchAllTask: refetchFn }),
  setRefetchAllUsers: (refetchFn) => set({ refetchAllUsers: refetchFn }),
  setRefetchStatus: (refetchFn) => set({ refetchStatus: refetchFn }),
  setStatus: (data) => set({ status: data }),
  setAllTask: (data) => set({ allTask: data }),
  setTaskId: (id) => set({ taskId: id }),
  setToggleSidebar: () =>
    set((prev) => ({
      toggleSidebar: !prev.toggleSidebar,
    })),
  handleOpenTask: (id) => {
    set((prev) => ({
      taskId: id || null,
      toggleUpdateTask: !prev.toggleUpdateTask,
    }))
  },
  setAllUsers: (data) => set({ allUsers: data }),
  updateAllTask: (updater: (prevTasks: IPAllTaskData[]) => IPAllTaskData[]) =>
    set((state) => ({ allTask: updater(state.allTask) })),
}))

interface IPTaskStoreProps {
  allUsers: IPAllUserData | { data: []; allData: [] }
  taskId: string | null
  toggleSidebar: boolean
  toggleUpdateTask: boolean
  allTask: IPAllTaskData[] | []
  status: IPData[]

  setStatus: (data: IPData[]) => void
  setTaskId: (data: string | null) => void
  setToggleSidebar: () => void
  handleOpenTask: (id: string | null) => void
  setAllTask: (data: IPAllTaskData[]) => void
  refetchAllTask: (() => Promise<any>) | null // Typing refetch as a function that returns a promise or null initially
  refetchAllUsers: (() => Promise<any>) | null // Typing refetch as a function that returns a promise or null initially
  refetchStatus: (() => Promise<any>) | null // Typing refetch as a function that returns a promise or null initially
  setRefetchAllTask: (refetchFn: () => Promise<any>) => void
  setRefetchAllUsers: (refetchFn: () => Promise<any>) => void
  setRefetchStatus: (refetchFn: () => Promise<any>) => void
  setAllUsers: (data: IPAllUserData) => void
  updateAllTask: (
    updater: (prevTasks: IPAllTaskData[]) => IPAllTaskData[],
  ) => void
}
type IPData = {
  value: string
  label: string
}

interface IPWorkspaceSwitcherProps {
  data: IPData[]
  setWorkSpaceData: (data: IPData[]) => void
  selectedWorkSpace?: IPData
  setSelectedWorkSpace: (data: IPData | undefined) => void
}
