<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "auth",
});

const localePath = useLocalePath();
await navigateTo(localePath("/"), { replace: true });
</script>
