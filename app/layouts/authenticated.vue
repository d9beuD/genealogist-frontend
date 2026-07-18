<script setup lang="ts">
const { user } = useAuth();
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="offcanvas">
      <SidebarHeader class="border-b border-sidebar-border px-4 py-5">
        <NuxtLink class="text-lg font-semibold tracking-tight" to="/">
          Genealogist
        </NuxtLink>
      </SidebarHeader>

      <SidebarContent />

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
