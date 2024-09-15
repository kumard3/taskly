import { AppShell, Loader, Modal } from '@mantine/core'
import { signIn, useSession } from 'next-auth/react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Calendar,
  CircleDot,
  FolderKanban,
  GitBranch,
  Github,
  Inbox,
  Layers,
  UserPlus,
  Users,
} from 'lucide-react'

import { Separator } from '../ui/separator'

export function MainLayout({
  children,
}: {
  children: ReactNode
  className?: string
}) {
  const { status } = useSession()

  if (status === 'unauthenticated') {
    void signIn()
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-custom-blue text-2xl">
            Redirecting to Login Page
          </h1>
          <Loader />
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return (
      <>
        <AppShell
          navbar={{
            width: 250,
            breakpoint: 'sm',
          }}
          padding="md"
        >
          <AppShell.Navbar p="xs" className="bg-card text-card-foreground ">
            <>
              <aside className="w-64 border-r border-border p-4">
                <div className="mb-6 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-md bg-primary"></div>
                  <span className="font-semibold">Kumard3</span>
                </div>
                <nav className="space-y-2">
                  {[
                    { icon: Inbox, label: 'Inbox' },
                    { icon: CircleDot, label: 'My issues' },
                    { icon: Layers, label: 'Initiatives' },
                    { icon: FolderKanban, label: 'Projects' },
                    { icon: Users, label: 'Teams' },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                  <Separator className="my-4" />
                  {[
                    { icon: Calendar, label: 'Cycles' },
                    { icon: UserPlus, label: 'Invite people' },
                    { icon: GitBranch, label: 'Try' },
                    { icon: Github, label: 'Link GitHub' },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </aside>
            </>
          </AppShell.Navbar>
          <AppShell.Main className="bg-card text-card-foreground">
            {children}
          </AppShell.Main>
        </AppShell>
      </>
    )
  }
}
