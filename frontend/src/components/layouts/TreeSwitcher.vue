<script setup lang="ts">
import { Check, ChevronsUpDown, Folder, FolderOpen, Plus } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useTreeStore } from '@/stores/tree'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const treeStore = useTreeStore()

const open = ref(false)

const selectedTreeName = computed(() => {
  return treeStore.selectedTree?.name ?? 'No tree selected'
})

const treeCount = computed(() => treeStore.trees.length)

const treeLabel = computed(() => {
  if (treeCount.value === 0) return 'Select a tree'
  return `${treeCount.value} tree${treeCount.value > 1 ? 's' : ''}`
})

const isIconFolderOpen = computed(() => treeStore.hasTree)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu v-model:open="open">
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            :class="{ 'cursor-not-allowed opacity-50': treeCount === 0 }"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            :disabled="treeCount === 0"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <FolderOpen v-if="isIconFolderOpen" class="size-4" />
              <Folder v-else class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ selectedTreeName }}
              </span>
              <span class="truncate text-xs">
                {{ treeLabel }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          v-if="treeCount"
          class="w-(--reka-dropdown-menu-trigger-width)"
          align="start"
        >
          <DropdownMenuItem
            v-for="tree in treeStore.trees"
            :key="tree.id"
            @select="() => { treeStore.selectTree(tree.id); open = false }"
          >
            {{ tree.name }}
            <Check v-if="tree.id === treeStore.selectedTreeId" class="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @select="() => { open = false }">
            <Plus class="mr-2" />
            Create new tree
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
