<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const route = useRoute();
const localePath = useLocalePath();

const routeId = computed(() => {
  const raw = route.params.id;
  return Array.isArray(raw) ? raw[0] : raw;
});

if (!routeId.value) {
  await navigateTo(localePath("/"), { replace: true });
} else {
  await navigateTo(localePath(`/trees/${routeId.value}/people`), { replace: true });
}
</script>
