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
				:widthSeparator="
					upgradeStore.versionInfo != undefined &&
					upgradeStore.versionInfo.is_new
				"
			>
				{{ upgradeStore.versionInfo?.current_version }}
			</bt-form-item>

			<bt-form-item
				v-if="
					upgradeStore.versionInfo && upgradeStore.versionInfo.is_new
				"
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
							{{ upgradeStore.versionInfo?.new_version }}
						</div>
					</div>
				</template>
				<div class="upgradeNow" v-if="loading">
					<span class="loader" />
					{{ t('checking_new_version_info') }}
				</div>
				<div
					class="upgradeNow"
					v-else-if="
						upgradeStore.upgradeState === UpgradeStatus.Running
					"
				>
					<span class="loader" />
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
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { notifyFailed, notifySuccess } from '../../../utils/btNotify';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import { UpgradeStatus } from '../../../utils/constants';
import { useUpgradeStore } from '../../../stores/Upgrade';
import { useDeviceStore } from '../../../stores/device';
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const deviceStore = useDeviceStore();
const upgradeStore = useUpgradeStore();
const { t } = useI18n();
const timer = ref();
const loading = ref(true);

const updateUpgradeState = async () => {
	await upgradeStore.queryUpgradeState();

	switch (upgradeStore.upgradeState) {
		case UpgradeStatus.Running:
			break;

		case UpgradeStatus.Completed:
			window.clearInterval(timer.value);
			notifySuccess(t('completed'));
			break;

		default:
			window.clearInterval(timer.value);
			notifyFailed(t('failed'));
			break;
	}
	await upgradeStore.checkLastOsVersion();
};

const handleUpgrade = async () => {
	upgradeStore
		.upgrade()
		.then(() => {
			timer.value = setInterval(() => {
				updateUpgradeState();
			}, 4000);
		})
		.catch(() => {
			upgradeStore.upgradeState = '';
			notifyFailed(t('failed'));
		});
};

onMounted(async () => {
	await upgradeStore.checkLastOsVersion();
	loading.value = false;
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
