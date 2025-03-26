<template>
	<bt-custom-dialog
		ref="CustomRef"
		:title="t('third_party_domain')"
		:skip="false"
		size="medium"
		:ok="t('confirm')"
		:cancel="t('cancel')"
		:okDisabled="!data || data.length == 0"
		:platform="deviceStore.platform"
		@onSubmit="onOKClick"
	>
		<terminus-edit :label="t('third_party_domain')" v-model="data" />

		<div
			class="q-mt-md"
			v-if="
				reverseProxyMode == ReverseProxyMode.OlaresTunnel ||
				reverseProxyMode == ReverseProxyMode.SelfBuiltFrp
			"
		>
			<div class="text-body3 text-ink-3">
				{{ t('Certificate') }}
			</div>
			<div class="q-mt-xs common-border">
				<q-input
					v-model="cert"
					borderless
					dense
					type="textarea"
					input-class="custom-placeholder text-body3"
					input-style="resize: none;padding: 8px 16px !important; height: 88px"
				/>
			</div>
		</div>

		<div
			class="q-mt-md"
			v-if="
				reverseProxyMode == ReverseProxyMode.OlaresTunnel ||
				reverseProxyMode == ReverseProxyMode.SelfBuiltFrp
			"
		>
			<div class="text-body3 text-ink-3">
				{{ t('Certificate Key') }}
			</div>
			<div class="q-mt-xs common-border">
				<q-input
					v-model="key"
					borderless
					dense
					type="textarea"
					input-class="custom-placeholder text-body3"
					input-style="resize: none;padding: 8px 16px !important; height: 88px"
				/>
			</div>
		</div>
	</bt-custom-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import TerminusEdit from '../../../base/TerminusEdit.vue';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '../../../../stores/device';
import { ReverseProxyMode } from '../../../../utils/constants';

defineProps({
	reverseProxyMode: {
		type: Number,
		required: false,
		default: ReverseProxyMode.NoNeed
	}
});

const data = ref('');

const cert = ref('');

const key = ref('');

const { t } = useI18n();

const CustomRef = ref();
const deviceStore = useDeviceStore();
async function onOKClick() {
	console.log(cert.value);

	CustomRef.value.onDialogOK({
		data: data.value,
		cert: cert.value,
		key: key.value
	});
}
</script>

<style lang="scss" scoped>
.common-border {
	border: 1px solid $separator;
	border-radius: 8px;
	height: 92px;
	overflow: hidden;
	// padding-top: 8px;
	// padding-bottom: 8px;
}
</style>
