<script setup lang="ts">
import { Check, ChevronsUpDown, Folder, FolderOpen, Plus } from '@lucide/vue'
import { computed, ref } from 'vue'

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

interface Tree {
  id: number
  name: string
}

const props = withDefaults(defineProps<{
  trees?: Tree[]
  selectedTreeId?: number | null
}>(), {
  trees: () => [],
  selectedTreeId: null,
})

const emit = defineEmits<{
  select: [treeId: number]
  create: []
}>()

const open = ref(false)

const getSelectedTree = computed(() => {
  return props.trees.find(t => t.id === props.selectedTreeId)
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu v-model:open="open">
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            :class="{ 'cursor-not-allowed opacity-50': !props.trees.length }"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            :disabled="!props.trees.length"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <FolderOpen v-if="props.selectedTreeId" class="size-4" />
              <Folder v-else class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">
                {{ props.selectedTreeId ? getSelectedTree?.name : 'No tree selected' }}
              </span>
              <span class="truncate text-xs">
                {{ props.trees.length ? `${props.trees.length} tree${props.trees.length > 1 ? 's' : ''}` : 'Select a tree' }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          v-if="props.trees.length"
          class="w-(--reka-dropdown-menu-trigger-width)"
          align="start"
        >
          <DropdownMenuItem
            v-for="tree in props.trees"
            :key="tree.id"
            @select="() => { emit('select', tree.id); open = false }"
          >
            {{ tree.name }}
            <Check v-if="tree.id === props.selectedTreeId" class="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @select="() => { emit('create'); open = false }">
            <Plus class="mr-2" />
            Create new tree
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
