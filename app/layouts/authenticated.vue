<script setup lang="ts">
import { FolderTree, House } from "@lucide/vue";

const { user } = useAuth();
const route = useRoute();
const { t } = useI18n();
const routeBaseName = useRouteBaseName();

const isTreesRoute = computed(() => routeBaseName(route) === "trees");
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
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child :is-active="isTreesRoute">
                <NuxtLinkLocale to="/trees">
                  <FolderTree aria-hidden="true" class="size-4 shrink-0" />
                  <span>{{ t("navigation.trees") }}</span>
                </NuxtLinkLocale>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
