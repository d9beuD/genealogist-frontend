<script setup lang="ts">
import { Check, ChevronsUpDown, Folder, FolderOpen, Plus } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTreesQuery } from '@/features/tree/api/trees'
import CreateTreeDialog from '@/features/tree/components/CreateTreeDialog.vue'
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

const { t } = useI18n()
const treeStore = useTreeStore()
const { data: trees } = useTreesQuery()

const open = ref(false)
const createTreeDialogOpen = ref(false)

const treeList = computed(() => trees.value ?? [])
const selectedTree = computed(() => {
  return treeList.value.find(tree => tree.id === treeStore.selectedTreeId) ?? null
})

const selectedTreeName = computed(() => {
  return selectedTree.value?.name ?? t('features.tree.noTreeSelected')
})

const treeCount = computed(() => treeList.value.length)

const treeLabel = computed(() => {
  if (treeCount.value === 0) return t('features.tree.selectATree')
  const key = treeCount.value > 1 ? 'treeCountOther' : 'treeCountOne'
  return t(`features.tree.${key}`, { count: treeCount.value })
})

const isIconFolderOpen = computed(() => selectedTree.value !== null)

watch(treeList, (nextTrees) => {
  if (trees.value === undefined || treeStore.selectedTreeId === null) {
    return
  }

  if (!nextTrees.some(tree => tree.id === treeStore.selectedTreeId)) {
    treeStore.deselectTree()
  }
})
</script>

<template>
  <CreateTreeDialog v-model:open="createTreeDialogOpen" />

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
          class="w-(--reka-dropdown-menu-trigger-width) bg-sidebar text-sidebar-foreground border-sidebar-border"
          align="start"
        >
          <DropdownMenuItem
            v-for="tree in treeList"
            :key="tree.id"
            @select="() => { treeStore.selectTree(tree.id); open = false }"
          >
            {{ tree.name }}
            <Check v-if="tree.id === treeStore.selectedTreeId" class="ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            @select.prevent="() => { open = false; createTreeDialogOpen = true }"
          >
            <Plus class="mr-2" />
            {{ t('features.tree.createNewTree') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
