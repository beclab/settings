<template>
	<q-dialog ref="dialogRef">
		<q-card class="policy-dialog">
			<DialogHeader
				:title="
					t('action_sub_policies', {
						action: editMode ? t('edit') : t('add')
					})
				"
				@close-action="onDialogCancel"
			></DialogHeader>
			<div class="policy-content column justify-start">
				<bt-form v-model:can-submit="canSubmit">
					<q-list class="q-list-class">
						<error-message-tip
							style="width: 100%; max-width: 100%"
							:is-error="!uriRef"
							:error-message="t('errors.please_input_url')"
						>
							<bt-form-item
								:title="t('effected_urls')"
								:margin-top="false"
								:width-separator="false"
							>
								<bt-edit-view :right="true" v-model="uriRef" />
							</bt-form-item>
						</error-message-tip>
						<bt-form-item
							:title="t('second_factor_model')"
							:width-separator="factorMode === FACTOR_MODEL.Two"
						>
							<bt-select
								v-model="factorMode"
								:options="factorModelOptions()"
							/>
						</bt-form-item>

						<bt-form-item
							v-if="factorMode === FACTOR_MODEL.Two"
							:title="t('one_time')"
						>
							<q-toggle v-model="oneTimeMode" />
						</bt-form-item>

						<error-message-tip
							style="width: 100%; max-width: 100%"
							:is-error="validDuration < 0 || validDuration > 100"
							:width-separator="false"
							:error-message="
								t('errors.please_enter_a_valid_number')
							"
						>
							<bt-form-item
								v-if="factorMode === FACTOR_MODEL.Two"
								:title="t('valid_duration')"
								:width-separator="false"
							>
								<bt-time-picker
									v-model="validDuration"
									unit=" s"
									:input-disabled="true"
								/>
							</bt-form-item>
						</error-message-tip>
					</q-list>
				</bt-form>

				<dialog-footer
					:confirm-text="t('submit')"
					:has-cancel="true"
					@cancel-action="onDialogCancel"
					@confirm-action="onOKClick"
					:confirmDisable="!canSubmit"
				/>
			</div>
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref, onMounted, PropType } from 'vue';
import {
	EntrancePolicy,
	FACTOR_MODEL,
	factorModelOptions
} from '../../../utils/constants';
import BtFormItem from '../../base/BtFormItem.vue';
import BtSelect from '../../base/BtSelect.vue';
import BtTimePicker from '../../base/BtTimePicker.vue';
import ErrorMessageTip from '../../base/ErrorMessageTip.vue';
import BtEditView from '../../base/BtEditView.vue';
import BtForm from '../../base/BtForm.vue';
import { useI18n } from 'vue-i18n';
import DialogHeader from '../../DialogHeader.vue';
import DialogFooter from '../../DialogFooter.vue';

const props = defineProps({
	editMode: {
		type: Boolean,
		default: false
	},
	policy: {
		type: Object as PropType<EntrancePolicy>,
		require: true
	}
});

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const { t } = useI18n();

const uriRef = ref();
const factorMode = ref();
const oneTimeMode = ref();
const validDuration = ref();

const canSubmit = ref();

onMounted(() => {
	if (props.policy) {
		uriRef.value = props.policy.uri;
		factorMode.value = props.policy.policy;
		oneTimeMode.value = props.policy.one_time;
		validDuration.value = props.policy.valid_duration;
	}
});

async function onOKClick() {
	if (props.policy) {
		const data: EntrancePolicy = {
			uri: uriRef.value,
			policy: factorMode.value,
			one_time: oneTimeMode.value,
			valid_duration: validDuration.value
		};
		onDialogOK(data);
	}
}
</script>
<style lang="scss" scoped>
.policy-dialog {
	max-width: 400px;
	width: 400px;
	height: auto;
	padding: 0;
	position: relative;

	.policy-dialog-header {
		width: 100%;
		height: 32px;
		background: $background-3;
		padding-left: 12px;
		padding-right: 12px;
	}

	.policy-content {
		width: 100%;
		height: calc(100% - 32px);
		padding: 20px;
	}
}

.q-dialog__inner--minimized > div {
	max-width: 400px;
}

.q-dialog__inner > div {
	border-radius: 12px;
}
</style>
