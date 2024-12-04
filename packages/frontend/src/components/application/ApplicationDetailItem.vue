<template>
	<q-item class="application-detail-item">
		<q-item-section class="item-margin-left">
			<div class="row items-center">
				<div style="position: relative; height: 32px">
					<img
						class="application-logo"
						:src="app.icon?.length > 0 ? app.icon : ''"
						style="border-radius: 10px"
					/>

					<ApplicationMobileStatus
						v-if="deviceStore.isMobile"
						:running="isRunning"
					/>
				</div>
				<div
					class="application-name"
					:class="{
						'text-body2': !deviceStore.isMobile,
						'text-subtitle3-m': deviceStore.isMobile
					}"
				>
					{{ app.title }}
				</div>
				<ApplicationStatus
					v-if="!deviceStore.isMobile"
					:running="isRunning"
					:realStatus="realStatus"
					class="q-ml-md"
				/>
			</div>
		</q-item-section>
		<q-item-section
			side
			v-if="!isRunning || (isRunning && !app.isSysApp)"
			class="item-margin-right"
		>
			<q-toggle v-model="isRunning" @click="toggle" />
		</q-item-section>
	</q-item>
</template>

<script lang="ts" setup>
import { TerminusApp } from '@bytetrade/core';
import { PropType, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useApplicationStore } from '../../stores/Application';
import { APP_STATUS, getApplicationStatus } from '../../utils/constants';
import ApplicationStatus from './ApplicationStatus.vue';
import { useDeviceStore } from '../../stores/device';
import ApplicationMobileStatus from './ApplicationMobileStatus.vue';

const $q = useQuasar();
const applicationStore = useApplicationStore();

const props = defineProps({
	app: {
		type: Object as PropType<TerminusApp>,
		required: true
	}
});

const isRunning = ref(props.app!.state == 'running');
const deviceStore = useDeviceStore();

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

watch(
	() => props.app.state,
	() => {
		realStatus.value = getApplicationStatus(props.app.state as APP_STATUS);
	}
);

const realStatus = ref(getApplicationStatus(props.app.state as APP_STATUS));
</script>

<style scoped lang="scss">
.application-detail-item {
	// height: 32px;
	// min-height: 32px;
	padding: 0;
	// background-color: red;
	height: 56px;

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
	.application-status {
		text-align: right;
		color: $ink-2;
		text-transform: capitalize;
		margin-left: 4px;
	}
}
</style>
