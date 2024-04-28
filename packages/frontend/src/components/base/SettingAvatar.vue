<template>
	<q-avatar :size="`${size}px`">
		<TerminusAvatar :info="adminStore.terminus" :size="size" />
	</q-avatar>
</template>

<script lang="ts" setup>
import { useAdminStore } from '../../stores/Admin';

defineProps({
	size: {
		type: Number,
		require: true
	}
});

const adminStore = useAdminStore();
</script>
