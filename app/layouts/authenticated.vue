<script setup lang="ts">
import { FolderTree, House } from "@lucide/vue";
import type { Tree } from "~/features/tree/domain/tree";
import { useTrees } from "~/features/tree/presentation/composables/useTrees";

const { user } = useAuth();
const { t } = useI18n();

const { selectedTree, setSelectedTree } = useSelectedTree();
const { trees, pending: treesPending, error: treesError } = await useTrees();

const hasTrees = computed(() => trees.value.length > 0);
const hasSelectedTree = computed(() => selectedTree.value !== undefined);

// Clear selection when the tree list changes and the currently selected
// tree id no longer exists in the list.
watch(trees, (newTrees) => {
  if (selectedTree.value && !newTrees.some((t: Tree) => t.id === selectedTree.value!.id)) {
    setSelectedTree(undefined);
  }
});

const selectedTreeId = computed({
  get: () => selectedTree.value ? String(selectedTree.value.id) : "",
  set: (value: string) => {
    if (value === "") {
      // Explicit "clear" selection
      setSelectedTree(undefined);
      return;
    }
    const tree = trees.value.find((t: Tree) => String(t.id) === value);
    // Only set when a matching tree is found — guards against stale
    // SelectItem values emitted before trees are loaded.
    if (tree) {
      setSelectedTree(tree);
    }
  },
});
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="offcanvas">
      <SidebarHeader class="border-b border-sidebar-border px-4 py-5">
        <NuxtLinkLocale class="flex items-center gap-2 text-lg font-semibold tracking-tight" to="/">
          <House aria-hidden="true" class="size-4 shrink-0" />
          Genealogist
        </NuxtLinkLocale>
      </SidebarHeader>

      <SidebarContent>
        <!-- Tree selector -->
        <SidebarGroup class="px-2 pt-2">
          <p class="px-2 text-xs font-medium text-sidebar-foreground/50">
            {{ t("trees.eyebrow") }}
          </p>

          <div v-if="treesPending" class="px-2 py-2">
            <Skeleton class="h-8 w-full" />
          </div>

          <div v-else-if="treesError" class="px-2 py-2 text-destructive text-xs">
            {{ t("trees.errorTitle") }}
          </div>

          <Select v-else-if="hasTrees" v-model="selectedTreeId">
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="t('sidebar.treeSelectorPlaceholder')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="tree in trees" :key="tree.id" :value="String(tree.id)">
                  <FolderTree aria-hidden="true" class="mr-2 size-4 shrink-0" />
                  <SelectItemText>{{ tree.name }}</SelectItemText>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <p v-else class="px-2 py-2 text-sm text-sidebar-foreground/50">
            {{ t("sidebar.treeSelectorNoTrees") }}
          </p>
        </SidebarGroup>

        <!-- Tree-internal navigation (only when a tree is selected) -->
        <SidebarGroup v-if="hasSelectedTree">
          <SidebarMenu>
            <p class="px-2 text-xs font-medium text-sidebar-foreground/50">
              {{ t("sidebar.treeNavLabel") }}
            </p>
            <!-- Tree-internal links will be added here as routes are created. -->
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter class="border-t border-sidebar-border px-4 py-4">
        <p class="truncate text-sm text-sidebar-foreground/70">
          {{ user?.email }}
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center border-b border-border px-4 md:px-6">
        <SidebarTrigger />
      </header>

      <div class="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
