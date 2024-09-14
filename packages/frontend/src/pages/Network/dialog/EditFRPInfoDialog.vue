<template>
	<q-dialog ref="dialogRef" @hide="onDialogCancel">
		<div class="common-dialog" style="border-radius: 16px">
			<DialogHeader
				:title="t('FRP Setup')"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="dialog-content-root">
				<terminus-edit
					v-model="serverAddress"
					:label="t('Server Address')"
					:show-password-img="false"
					style="width: 100%"
				/>
				<terminus-edit
					v-model="port"
					class="q-mt-md"
					:label="t('Port')"
					:show-password-img="false"
					style="width: 100%"
				/>
				<terminus-edit
					v-model="authMethod"
					class="q-mt-md"
					:label="t('Auth Method')"
					:show-password-img="false"
					:hint-text="t('optional')"
					style="width: 100%"
				/>
				<terminus-edit
					v-model="token"
					class="q-mt-md"
					:label="t('Auth.Token')"
					:show-password-img="false"
					:hint-text="t('optional')"
					style="width: 100%"
				/>
				<dialog-footer
					:confirm-text="t('ok')"
					:cancelText="t('cancel')"
					:confirm-disable="!enableCreate"
					@confirm-action="updateFrp"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { computed, PropType, ref } from 'vue';
import DialogHeader from '../../../components/DialogHeader.vue';
import DialogFooter from '../../../components/DialogFooter.vue';
import { useI18n } from 'vue-i18n';
import TerminusEdit from '../../../components/base/TerminusEdit.vue';
import { ReverseProxy } from '../../../stores/network';
const props = defineProps({
	proxy: {
		type: Object as PropType<ReverseProxy>,
		required: true
	}
});

const { t } = useI18n();

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const serverAddress = ref(props.proxy.frp_server);

const port = ref(`${props.proxy.frp_port == 0 ? '' : props.proxy.frp_port}`);

const authMethod = ref(props.proxy.frp_auth_method);

const token = ref(props.proxy.frp_auth_token);

const serverAddressRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.item_is_empty', {
			item: t('Server Address')
		});
	}
	return '';
};

const portRule = (val: string) => {
	if (val.length === 0) {
		return t('errors.item_is_empty', {
			item: t('Port')
		});
	}
	return '';
};

// const authMethodRule = (val: string) => {
// 	if (val.length === 0) {
// 		return t('errors.item_is_empty', {
// 			item: t('Auth Method')
// 		});
// 	}
// 	return '';
// };

// const tokenRule = (val: string) => {
// 	if (val.length === 0) {
// 		return t('errors.item_is_empty', {
// 			item: t('Auth.Token')
// 		});
// 	}
// 	return '';
// };

const enableCreate = computed(() => {
	return (
		serverAddressRule(serverAddress.value).length == 0 &&
		portRule(port.value).length == 0
	);
});

const updateFrp = async () => {
	console.log('serverAddress ===>', serverAddress.value);
	console.log('port ===>', port.value);
	console.log('authMethod ===>', authMethod.value);
	console.log('token ===>', token.value);
	const saveProxy = props.proxy;
	saveProxy.frp_server = serverAddress.value;
	saveProxy.frp_port = Number(port.value);
	saveProxy.frp_auth_method = authMethod.value;
	saveProxy.frp_auth_token = token.value;
	onDialogOK(saveProxy);
};
</script>

<style scoped lang="scss">
.cpu-core {
	text-align: right;
}

.dialog-content-root {
	.item-content {
		height: 56px;
		width: 100%;
		border: 1px solid $separator;
		border-radius: 12px;
	}
}
</style>
