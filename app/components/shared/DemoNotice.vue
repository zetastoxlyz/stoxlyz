<script setup lang="ts">
// Shown once per browser session until the data layer is live and licensed.
const STORAGE_KEY = "stoxlyz-demo-notice-seen";

const { t } = useI18n();
const open = ref(false);

onMounted(() => {
	try {
		open.value = sessionStorage.getItem(STORAGE_KEY) !== "1";
	} catch {
		open.value = true;
	}
});

function dismiss() {
	open.value = false;
	try {
		sessionStorage.setItem(STORAGE_KEY, "1");
	} catch {
		// Private mode or blocked storage: the notice simply shows again next visit
	}
}
</script>

<template>
  <Dialog :open="open" @update:open="(value) => { if (!value) dismiss(); }">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <span
          class="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400"
        >
          <span class="h-2 w-2 rounded-full bg-amber-500" />
          {{ t("demoNotice.badge") }}
        </span>
        <DialogTitle class="text-xl">{{ t("demoNotice.title") }}</DialogTitle>
        <DialogDescription class="space-y-2 pt-1 text-sm leading-relaxed">
          <span class="block">{{ t("demoNotice.body") }}</span>
          <span class="block font-medium text-foreground">{{ t("demoNotice.warning") }}</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button class="w-full sm:w-auto" @click="dismiss">{{ t("demoNotice.cta") }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
