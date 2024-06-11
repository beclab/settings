<template>
	<q-item class="application-detail-item">
		<q-item-section>
			<div class="row items-center">
				<img
					class="application-logo"
					:src="app.icon?.length > 0 ? app.icon : ''"
					style="border-radius: 10px"
				/>
				<div class="text-body2 application-name">
					{{ firstToUpper(app.name) }}
				</div>
				<div
					class="status-circle"
					:style="{
						'--status-color': isRunning ? '#29CC5F' : '#FEBE01'
					}"
				></div>
				<div class="text-subtitle3 application-status">
					{{ app.state }}
				</div>
			</div>
		</q-item-section>
		<q-item-section side v-if="!isRunning || (isRunning && !app.isSysApp)">
			<q-toggle v-model="isRunning" @click="toggle" />
		</q-item-section>
	</q-item>
</template>

<script lang="ts" setup>
import { TerminusApp } from '@bytetrade/core';
import { PropType, ref } from 'vue';
import { firstToUpper } from '../../constant';
import { useQuasar } from 'quasar';
import { useApplicationStore } from '../../stores/Application';
const $q = useQuasar();
const applicationStore = useApplicationStore();

const props = defineProps({
	app: {
		type: Object as PropType<TerminusApp>,
		required: true
	}
});

const isRunning = ref(props.app!.state == 'running');

async function toggle() {
	$q.loading.show();
	try {
		if (isRunning.value) {
			await applicationStore.resume(props.app.name);
		} else {
			await applicationStore.suspend(props.app.name);
		}
		await applicationStore.status(props.app.name);
	} catch (e) {
		/* empty */
	} finally {
		$q.loading.hide();
	}
}
</script>

<style scoped lang="scss">
.application-detail-item {
	height: 32px;
	min-height: 32px;
	padding: 0;

	.application-logo {
		width: 32px;
		height: 32px;
		border-radius: 8px;
	}

	.application-name {
		text-transform: capitalize;
		color: $ink-1;
		margin-left: 8px;
	}

	.status-circle {
		width: 8px;
		height: 8px;
		margin-left: 10px;
		border-radius: 50%;
		background-color: var(--status-color);
	}

	.application-status {
		text-align: right;
		color: $ink-2;
		text-transform: capitalize;
		margin-left: 4px;
	}
}
</style>
