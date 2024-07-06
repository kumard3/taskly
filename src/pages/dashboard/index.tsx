import React from "react";

import { HybridLayout } from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Bell,
  Filter,
  MoreHorizontal,
  Plus,
  ChevronDown,
  Share2,
  Settings,
  List,
  LayoutGrid,
  Calendar,
  FileText,
} from "lucide-react";
export default function Dashboard() {
  return (
    <HybridLayout>
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">My tasks</h2>
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="text-sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="ghost" className="text-sm">
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>
          <div className="mb-4 flex space-x-2">
            <Button variant="secondary" className="text-sm">
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button variant="ghost" className="text-sm">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Board
            </Button>
            <Button variant="ghost" className="text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button variant="ghost" className="text-sm">
              <FileText className="mr-2 h-4 w-4" />
              Files
            </Button>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <Button variant="secondary" className="text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add task
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Filter className="mr-1 h-3 w-3" />
                Filter: 1
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Group by
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                Sort
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-280px)]">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="pb-2">Task name</th>
                  <th className="pb-2">Due date</th>
                  <th className="pb-2">Projects</th>
                  <th className="pb-2">Task visibility</th>
                  <th className="pb-2">Collaborators</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-800 text-sm">
                  <td className="py-2 font-medium">Recently assigned</td>
                </tr>
                {[
                  "Research target audience and competitors",
                  "jj",
                  "jhb",
                  "khb",
                  "test",
                  "sdcsdc",
                  "Define project scope and objectives",
                  // ... add more tasks as needed
                ].map((task, index) => (
                  <tr key={index} className="border-t border-gray-800 text-sm">
                    <td className="py-2">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        {task}
                      </div>
                    </td>
                    <td className="py-2 text-pink-400">
                      {index === 0 ? "Jun 24 - 26" : ""}
                    </td>
                    <td className="py-2">
                      {index === 0 ? (
                        <span className="rounded bg-teal-900 px-2 py-1 text-xs text-teal-300">
                          Website Development
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="py-2 text-gray-400">
                      {index === 0 ? "My workspace" : "Only me"}
                    </td>
                    <td className="py-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </div>
    </HybridLayout>
  );
}
