<script setup lang="ts">
import { Calendar, Folder, House, LogOut, Search, User } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const auth = useAuthStore()
const route = useRoute()

function isActive(path: string): boolean {
  return path === '/'
    ? route.name === 'home'
    : route.path.startsWith(path)
}
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader class="border-b px-6 py-4">
        <div class="flex items-center gap-2 font-semibold">
          <Folder class="h-5 w-5" />
          <span>Genealogist</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :data-active="isActive('/')">
                  <router-link to="/">
                    <House />
                    <span>Home</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :data-active="isActive('/trees')">
                  <router-link to="/trees">
                    <Folder />
                    <span>Trees</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :data-active="isActive('/search')">
                  <router-link to="/search">
                    <Search />
                    <span>Search</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :data-active="isActive('/people')">
                  <router-link to="/people">
                    <User />
                    <span>People</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child :data-active="isActive('/calendar')">
                  <router-link to="/calendar">
                    <Calendar />
                    <span>Calendar</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton>
                  <User />
                  <span v-if="auth.user">{{ auth.user.email }}</span>
                  <span v-else>User</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" class="w-56">
                <DropdownMenuItem @click="auth.logout()">
                  <LogOut />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header class="flex h-12 items-center gap-2 border-b px-4">
        <SidebarTrigger />
      </header>
      <main class="flex-1 p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
