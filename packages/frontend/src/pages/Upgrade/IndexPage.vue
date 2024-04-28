<template>
	<page-title-component :show-back="false" title="Upgrade" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list class="q-list-class">
			<q-item class="list_section">
				<q-item-section> {{ t('current_version') }} </q-item-section>
				<q-item-section side>
					{{ versionInfo?.current_version }}
				</q-item-section>
			</q-item>
			<q-separator class="q-list-sep-line" />
			<q-item class="list_section">
				<q-item-section> {{ t('development_mode') }} </q-item-section>
				<q-item-section side>
					<q-toggle v-model="dev_mode" />
				</q-item-section>
			</q-item>
			<q-separator
				class="q-list-sep-line"
				v-if="versionInfo && versionInfo.is_new"
			/>
			<q-item
				class="list_section"
				v-if="versionInfo && versionInfo.is_new"
			>
				<q-item-section>
					<div class="row items-center">
						<div>{{ t('new_version') }}</div>
						<div style="margin-left: 8px; color: #757575">
							{{ versionInfo?.new_version }}
						</div>
					</div>
				</q-item-section>
				<q-item-section side>
					<div class="upgradeNow" v-if="upgradeState === 'running'">
						<span class="loader"></span>
						{{ t('upgrading') }}
					</div>
					<div class="upgradeNow" @click="handleUpgrade" v-else>
						{{ t('upgrade_now') }}
					</div>
				</q-item-section>
			</q-item>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useUpgradeStore } from 'src/stores/Upgrade';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import { notifyFailed, notifySuccess } from '../../utils/btNotify';

const { t } = useI18n();
const upgradeStore = useUpgradeStore();

const versionInfo = ref();
const upgradeState = ref();
const timer = ref();
const dev_mode = ref(
	localStorage.getItem('dev_mode') === 'true' ? true : false
);

const new_version = async () => {
	versionInfo.value = await upgradeStore.new_version();
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
	const res = await upgradeStore.upgrade();
	if (res) {
		timer.value = setInterval(() => {
			startUpgradeState();
		}, 4000);
	} else {
		upgradeState.value = null;
	}
};

watch(
	() => dev_mode.value,
	(newVal) => {
		localStorage.setItem('dev_mode', String(newVal));
		window.parent.postMessage(
			{
				type: 'dev_mode',
				message: String(newVal)
			},
			'*'
		);

		new_version();
	}
);

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
	border: 1px solid rgba(0, 0, 0, 0.12);
	padding: 4px 6px;
	border-radius: 6px;
	cursor: pointer;
	color: #757575;
	background-color: #fffffb;

	&:hover {
		background: #eeeeeb;
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
