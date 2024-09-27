<template>
	<page-title-component :show-back="true" :title="t('GPU')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item
				:title="t('VRAM mode')"
				:margin-top="false"
				:chevron-right="false"
				:widthSeparator="false"
			>
				<bt-select
					v-model="videoMemoryMode"
					:options="VRAMModeOptions()"
					@update:modelValue="vramUpdate"
				/>
			</bt-form-item>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../stores/device';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { VRAMMode, VRAMModeOptions } from '../../../utils/constants';
import BtSelect from '../../../components/base/BtSelect.vue';
import ReminderDialogComponent from '../../../components/ReminderDialogComponent.vue';
import { useGPUStore } from '../../../stores/GPU';

import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';

const deviceStore = useDeviceStore();
const { t } = useI18n();

const videoMemoryMode = ref(VRAMMode.Standalone);
const $q = useQuasar();
const gpuStore = useGPUStore();

const vramUpdate = (mode: VRAMMode) => {
	if (gpuStore.currentVRAMMode == mode) {
		return;
	}
	const vramItem = VRAMModeOptions().find((e) => e.value == mode);
	if (!vramItem) {
		return;
	}
	$q.dialog({
		component: ReminderDialogComponent,
		componentProps: {
			title: t('Switch VRAM mode'),
			message: t(
				'Are you sure you need to switch the VRAM mode to {mode}?',
				{
					mode: vramItem.label
				}
			),
			useCancel: true,
			confirmText: t('confirm'),
			cancelText: t('cancel')
		}
	})
		.onOk(async () => {
			await gpuStore.setManagerMemoryMode(mode);
			videoMemoryMode.value = gpuStore.currentVRAMMode;
		})
		.onCancel(() => {
			videoMemoryMode.value = gpuStore.currentVRAMMode;
		});
};

watch(
	() => gpuStore.managed_memory,
	() => {
		videoMemoryMode.value = gpuStore.managed_memory
			? VRAMMode.Shared
			: VRAMMode.Standalone;
	},
	{
		immediate: true
	}
);

onMounted(() => {
	gpuStore.configManagerMemoryMode();
});
</script>

<style scoped lang="scss">
.list_section {
	min-height: 56px;
}

.upgradeNow {
	border: 1px solid $btn-stroke;
	padding: 8px 12px;
	border-radius: 8px;
	cursor: pointer;
	// background-color: $background-3;

	&:hover {
		background: $background-5;
	}
}

.loader {
	width: 1rem;
	height: 1rem;
	color: inherit;
	vertical-align: middle;
	border: 0.2em solid transparent;
	border-top-color: currentcolor;
	border-bottom-color: currentcolor;
	border-radius: 50%;
	position: relative;
	animation: 1s loader-30 linear infinite;
	display: inline-block;

	&:before,
	&:after {
		content: '';
		display: block;
		width: 0;
		height: 0;
		position: absolute;
		border: 0.2em solid transparent;
		border-bottom-color: currentcolor;
	}

	&:before {
		transform: rotate(135deg);
		right: -0.2em;
		top: -0.05em;
	}

	&:after {
		transform: rotate(-45deg);
		left: -0.2em;
		bottom: -0.05em;
	}
}

@keyframes loader-30 {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
