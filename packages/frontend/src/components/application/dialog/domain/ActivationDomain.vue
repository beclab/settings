<template>
	<q-dialog ref="dialogRef">
		<bt-dialog
			:title="t('activation_third_party_domain')"
			@onCancel="onDialogCancel"
			@onConfirm="onDialogOK"
		>
			<q-label class="q-pt-sm"
				>{{
					t(
						'in_order_to_apply_third_party_domain_to_this_app_you_need_to_add_a_dns_cname_record_domain_to_your_domain_target',
						{
							domain: thirdPartyDomain,
							target: cnameTarget
						}
					)
				}}
			</q-label>
		</bt-dialog>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import BtDialog from '../../../base/BtDialog.vue';
import { useI18n } from 'vue-i18n';

defineProps({
	thirdPartyDomain: {
		type: String,
		require: true
	},
	cnameTarget: {
		type: String,
		require: true
	}
});
const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();
const { t } = useI18n();
</script>
