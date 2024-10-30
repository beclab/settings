<template>
	<page-title-component :show-back="true" :title="t('version')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item
				:title="t('current_version')"
				:margin-top="false"
				:chevron-right="false"
				:widthSeparator="versionInfo != undefined && versionInfo.is_new"
			>
				{{ versionInfo?.current_version }}
			</bt-form-item>

			<bt-form-item
				v-if="versionInfo && versionInfo.is_new"
				:margin-top="false"
				:chevron-right="false"
				:widthSeparator="false"
			>
				<template v-slot:title>
					<div class="row items-center">
						<div>{{ t('new_version') }}</div>
						<div
							style="margin-left: 5px"
							:class="
								deviceStore.isMobile
									? 'text-blue'
									: 'text-ink-3'
							"
						>
							{{ versionInfo?.new_version }}
						</div>
					</div>
				</template>
				<div class="upgradeNow" v-if="upgradeState === 'running'">
					<span class="loader"></span>
					{{ t('upgrading') }}
				</div>
				<div class="upgradeNow" @click="handleUpgrade" v-else>
					{{ t('upgrade_now') }}
				</div>
			</bt-form-item>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useUpgradeStore } from '../../../stores/Upgrade';
import { notifyFailed, notifySuccess } from '../../../utils/btNotify';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../stores/device';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';

const deviceStore = useDeviceStore();
const { t } = useI18n();
const upgradeStore = useUpgradeStore();

const versionInfo = ref();
const upgradeState = ref();
const timer = ref();

const new_version = async () => {
	try {
		versionInfo.value = await upgradeStore.new_version();
	} catch (error) {
		console.log(error);
	}
};

const startUpgradeState = async () => {
	const res = await upgradeStore.upgradeState();
	if (res) {
		upgradeState.value = res.state;
		switch (res.state) {
			case 'running':
				break;

			case 'complete':
				window.clearInterval(timer.value);
				notifySuccess(t('completed'));
				break;

			default:
				window.clearInterval(timer.value);
				notifyFailed(t('failed'));
				break;
		}
		new_version();
	}
};

const handleUpgrade = async () => {
	upgradeState.value = 'running';
	try {
		const res = await upgradeStore.upgrade();
		if (res) {
			timer.value = setInterval(() => {
				startUpgradeState();
			}, 4000);
		}
	} catch (error) {
		upgradeState.value = null;
	}
};

onMounted(() => {
	new_version();
});

onUnmounted(() => {
	window.clearInterval(timer.value);
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
