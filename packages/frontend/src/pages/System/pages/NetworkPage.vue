<template>
	<page-title-component :show-back="true" :title="t('home_menus.network')">
	</page-title-component>
	<bt-scroll-area
		class="nav-height-scroll-area-conf"
		v-if="networkStore.reverseProxy"
	>
		<div class="text-subtitle1 text-ink-1 person-title q-mt-md">
			{{ t('Reverse Proxy') }}
		</div>
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item
				:title="t('Set up a reverse proxy for external access')"
				:margin-top="false"
				:chevron-right="false"
				:widthSeparator="
					reverseProxyMode != ReverseProxyMode.CloudFlare &&
					reverseProxyMode != ReverseProxyMode.NoNeed
				"
			>
				<bt-select
					v-if="reverseProxyMode != ReverseProxyMode.NoNeed"
					v-model="reverseProxyMode"
					:options="reverseProxyOptions()"
				/>
				<div v-else>No need (IP Direct)</div>
			</bt-form-item>

			<bt-form-item
				v-if="reverseProxyMode == ReverseProxyMode.OlaresTunnel"
				:title="t('Select a Olares tunnel')"
				:margin-top="false"
				:chevron-right="false"
				:widthSeparator="false"
			>
				<bt-select
					v-model="olaresTunnelMode"
					:options="olaresTunnelsOptions"
				/>
			</bt-form-item>

			<error-message-tip
				v-if="reverseProxyMode == ReverseProxyMode.SelfBuiltFrp"
				:with-popup="true"
				:width-separator="true"
			>
				<bt-form-item
					:title="t('Server Address')"
					:width-separator="false"
				>
					<bt-edit-view
						style="width: 200px"
						v-model="serverAddress"
						:right="true"
						:placeholder="t('Please input server address')"
					/>
				</bt-form-item>
			</error-message-tip>

			<error-message-tip
				v-if="reverseProxyMode == ReverseProxyMode.SelfBuiltFrp"
				:with-popup="true"
				:width-separator="true"
			>
				<bt-form-item :title="t('Port')" :width-separator="false">
					<bt-edit-view
						style="width: 200px"
						v-model="port"
						:right="true"
						:placeholder="t('Please input port')"
					/>
				</bt-form-item>
			</error-message-tip>

			<error-message-tip
				v-if="reverseProxyMode == ReverseProxyMode.SelfBuiltFrp"
				:with-popup="true"
				:width-separator="authMethod == 'token'"
			>
				<bt-form-item
					:title="t('Auth Method')"
					:width-separator="false"
				>
					<bt-select
						v-model="authMethod"
						:options="frpAuthMethod()"
					/>
				</bt-form-item>
			</error-message-tip>

			<error-message-tip
				v-if="
					reverseProxyMode == ReverseProxyMode.SelfBuiltFrp &&
					authMethod == 'token'
				"
				:with-popup="true"
				:width-separator="false"
			>
				<bt-form-item :title="t('Token')" :width-separator="false">
					<bt-edit-view
						style="width: 200px"
						v-model="token"
						:right="true"
						:placeholder="t('Please input token')"
					/>
				</bt-form-item>
			</error-message-tip>
		</q-list>
		<div
			class="row justify-end"
			v-if="reverseProxyMode != ReverseProxyMode.NoNeed"
		>
			<q-btn
				dense
				flat
				class="confirm-btn q-px-md"
				style="margin-top: 20px"
				:label="t('save')"
				@click="onSubmit"
			/>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
// import { useQuasar } from 'quasar';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../stores/device';
import { useNetworkStore } from '../../../stores/network';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import {
	reverseProxyOptions,
	ReverseProxyMode,
	frpAuthMethod,
	olaresTunnelDefaultValue
} from '../../../utils/constants';
import BtSelect from '../../../components/base/BtSelect.vue';
// import EditFRPInfoDialog from './dialog/EditFRPInfoDialog.vue';
import { useQuasar } from 'quasar';

import BtEditView from '../../../components/base/BtEditView.vue';
import ErrorMessageTip from '../../../components/base/ErrorMessageTip.vue';
import AffectedDomainDialog from '../../../components/network/dialog/AffectedDomainDialog.vue';

import { useApplicationStore } from '../../../stores/application';

const { t } = useI18n();

const $q = useQuasar();

const deviceStore = useDeviceStore();
const networkStore = useNetworkStore();
const applicationStore = useApplicationStore();

const reverseProxyMode = ref(ReverseProxyMode.NoNeed);

const olaresTunnelMode = ref('');

const serverAddress = ref('');

const port = ref('');

const authMethod = ref('');

const token = ref('');

watch(
	() => networkStore.reverseProxy,
	() => {
		configData();
	}
);

const configData = () => {
	if (networkStore.reverseProxy) {
		reverseProxyMode.value = networkStore.reverseProxy
			.enable_cloudflare_tunnel
			? ReverseProxyMode.CloudFlare
			: networkStore.reverseProxy.enable_frp
			? networkStore.reverseProxy.frp_auth_method == 'jws'
				? ReverseProxyMode.OlaresTunnel
				: ReverseProxyMode.SelfBuiltFrp
			: ReverseProxyMode.NoNeed;

		const olaresOptions = networkStore.olaresTunnelsOptions();
		olaresTunnelsOptions.value = olaresOptions;

		const option = olaresOptions.find(
			(e) => e.value == networkStore.reverseProxy?.frp_server
		);

		if (option) {
			olaresTunnelMode.value = option.value;
		} else if (olaresOptions && olaresOptions.length > 0) {
			olaresTunnelMode.value = olaresOptions[0].value;
		}

		if (reverseProxyMode.value != ReverseProxyMode.OlaresTunnel) {
			serverAddress.value = networkStore.reverseProxy.frp_server;
			port.value = `${
				networkStore.reverseProxy.frp_port == 0
					? ''
					: networkStore.reverseProxy.frp_port
			}`;
			authMethod.value = networkStore.reverseProxy.frp_auth_method;
			token.value = networkStore.reverseProxy.frp_auth_token;
		}
	}
};

const olaresTunnelsOptions = ref<any>();

onMounted(async () => {
	configData();
	await networkStore.configReverseProxy();
	await applicationStore.getEntranceSetupDomain();
});

const onSubmit = async () => {
	if (!networkStore.reverseProxy) {
		return;
	}

	if (reverseProxyMode.value == ReverseProxyMode.SelfBuiltFrp) {
		if (serverAddress.value.length == 0 || port.value.length == 0) {
			return;
		}
		if (authMethod.value == 'token' && token.value.length == 0) {
			return;
		}
	}
	let reminderMessage = t(
		'During the reverse proxy switch, Olares may be inaccessible for 10 minutes.'
	);
	let affectedDomains = [];
	if (
		networkStore.reverseProxy.enable_cloudflare_tunnel &&
		(reverseProxyMode.value == ReverseProxyMode.OlaresTunnel ||
			reverseProxyMode.value == ReverseProxyMode.SelfBuiltFrp)
	) {
		reminderMessage =
			'切换到FRP后，自定义域将不再有效。要恢复功能，您需要在应用程序>入口页面上传HTTPS证书。切换最多可能需要10分钟才能完成，在此期间Olares可能无法访问。';
		affectedDomains = applicationStore.customDomainApplications;
	} else if (reverseProxyMode.value == ReverseProxyMode.CloudFlare) {
		reminderMessage = t(
			"After switching to Cloudflare, the custom domain will be updated and resolved to work with Cloudflare's network. The switch may take up to 10 minutes to complete, during which Olares may be inaccessible."
		);
	}

	$q.dialog({
		component: AffectedDomainDialog,
		componentProps: {
			title: t('Switch reverse proxy'),
			message: reminderMessage,
			useCancel: true,
			confirmText: t('confirm'),
			cancelText: t('cancel'),
			affectedDomains
		}
	}).onOk(async () => {
		confirmSwitch();
	});
	// console.log(
	// 	'networkStore.reverseProxy.enable_frp ===>',
	// 	networkStore.reverseProxy.enable_frp
	// );
	// console.log(reverseProxyMode.value);
};

const confirmSwitch = async () => {
	if (!networkStore.reverseProxy) {
		return;
	}
	if (
		reverseProxyMode.value == ReverseProxyMode.OlaresTunnel ||
		reverseProxyMode.value == ReverseProxyMode.SelfBuiltFrp
	) {
		networkStore.reverseProxy.enable_frp = true;
		networkStore.reverseProxy.enable_cloudflare_tunnel = false;
	} else if (reverseProxyMode.value == ReverseProxyMode.CloudFlare) {
		networkStore.reverseProxy.enable_frp = false;
		networkStore.reverseProxy.enable_cloudflare_tunnel = true;
	}

	if (reverseProxyMode.value == ReverseProxyMode.OlaresTunnel) {
		Object.assign(networkStore.reverseProxy, olaresTunnelDefaultValue);
		networkStore.reverseProxy.frp_server = olaresTunnelMode.value;
	} else if (reverseProxyMode.value == ReverseProxyMode.SelfBuiltFrp) {
		let server = serverAddress.value;
		if (
			serverAddress.value.startsWith('http://') ||
			serverAddress.value.startsWith('https://')
		) {
			server = server.split('//')[1];
		}
		networkStore.reverseProxy.frp_server = server;
		networkStore.reverseProxy.frp_port = Number(port.value);
		networkStore.reverseProxy.frp_auth_method = authMethod.value;
		networkStore.reverseProxy.frp_auth_token = token.value;
	}
	$q.loading.show();
	await networkStore.updateReverseProxy(networkStore.reverseProxy);
	$q.loading.hide();
};

onMounted(() => {});
</script>

<style scoped lang="scss">
.directory-tips {
	margin-top: 12px;
	margin-bottom: 12px;
	color: $ink-2;
}

.add-btn {
	border-radius: 8px;
	padding: 6px 12px;
	border: 1px solid $separator;
	cursor: pointer;
	text-decoration: none;

	.add-title {
		color: $ink-2;
	}
}
.add-btn:hover {
	background-color: $background-3;
}
.directory-image {
	width: 24px;
	height: 24px;
}

.folder-content {
	width: 100%;
	// height: 56px;
	// background-color: red;
	padding-top: 12px;

	.path_content {
		width: calc(100% - 40px);
		word-wrap: word-break;
		word-break: break-all;

		.path {
			width: calc(100% - 40px);
			margin-top: 2px;
			margin-bottom: 10px;
			// background: green;
		}
	}
}

.popup-list {
	width: 120px;
	padding: 8px;
	border-radius: 8px;
	box-shadow: 0px 4px 10px 0px #00000033;
}
.empty-image {
	margin-top: 144px;
	width: 160px;
	height: 160px;
}
</style>
