<template>
	<div class="adaptive-root" v-if="deviceStore.isMobile">
		<slot name="mobile" />
	</div>
	<div class="adaptive-root" v-else>
		<slot name="pc" />
	</div>
</template>

<script lang="ts" setup>
import { useDeviceStore } from '../stores/device';

const deviceStore = useDeviceStore();
</script>

<style lang="scss" scoped>
.adaptive-root {
	width: 100%;
	height: 100%;
}
</style>
