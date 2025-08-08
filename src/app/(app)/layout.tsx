'use client';

import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, Ghost, LogOut, ShieldQuestion, UserSquare } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { username, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    const parts = name.split('_');
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 -rotate-1">
            <Ghost className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="font-headline text-2xl font-bold">404 Haunting</h1>
           </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/create-profile')} tooltip="Edit Your Lies">
                <UserSquare />
                Profile
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/personality-quiz')} tooltip="Questionable Science">
                <ShieldQuestion />
                Personality Quiz
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/swipe')} tooltip="Embrace Rejection">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-crack"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3 2-2"/></svg>
                Swipe Failures
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/chatbot')} tooltip="Terrible Advice Here">
                <Bot />
                Disaster Chatbot
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3">
                 <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="glitched face" />
                    <AvatarFallback>{getInitials(username)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-sm truncate">{username || 'Anonymous Ghost'}</span>
                    <span className="text-xs text-muted-foreground">Probably Single</span>
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
                <LogOut className="size-4" />
                Escape
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 relative min-h-screen">
          <div className="absolute top-4 right-4 md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
