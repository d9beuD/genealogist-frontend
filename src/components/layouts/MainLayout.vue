<script setup lang="ts">
import { Folder, House, LogOut, User } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTreesQuery } from '@/features/tree/api/trees'
import { useAuthStore } from '@/stores/auth'
import { useTreeStore } from '@/stores/tree'
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
import TreeSwitcher from '@/components/layouts/TreeSwitcher.vue'

const auth = useAuthStore()
const treeStore = useTreeStore()
const route = useRoute()
const { data: trees } = useTreesQuery()

const hasSelectedTree = computed(() => {
  return trees.value?.some(tree => tree.id === treeStore.selectedTreeId) ?? false
})

function isActive(path: string): boolean {
  return path === '/'
    ? route.name === 'home'
    : route.path.startsWith(path)
}
</script>

<template>
  <SidebarProvider class="h-svh">
    <Sidebar class="h-full">
      <SidebarHeader class="px-2 py-2">
        <TreeSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup v-if="hasSelectedTree">
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

    <SidebarInset class="flex min-h-svh flex-col">
      <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
      </header>
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
