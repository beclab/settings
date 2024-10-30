<template>
	<q-list
		:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		class="text-background-1"
	>
		<slot />
	</q-list>
</template>

<script setup lang="ts">
import { useDeviceStore } from '../../stores/device';
const deviceStore = useDeviceStore();
</script>
