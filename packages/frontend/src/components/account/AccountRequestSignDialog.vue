<template>
	<q-dialog ref="dialogRef">
		<q-card class="policy-dialog">
			<div class="policy-dialog-header row justify-between items-center">
				<div class="text-subtitle3 policy-title">{{ title }}</div>
				<q-icon
					size="16px"
					name="sym_r_clear"
					color="grey-8"
					@click="onDialogCancel"
				/>
			</div>
			<div class="policy-content column justify-start">
				<div class="text-body3 policy-content__info">
					{{ info }}
				</div>
				<q-img
					class="policy-content__image"
					:src="imagePath"
					v-if="imagePath && imagePath.length"
				/>
				<div class="row justify-end" style="margin-top: 52px">
					<q-btn
						dense
						class="confirm-btn confirm-r-btn"
						:label="t('confirm')"
						flat
						@click="onOKClick"
					/>
				</div>
			</div>
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { useI18n } from 'vue-i18n';

defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	},
	info: {
		type: String,
		required: false,
		default: ''
	},
	imagePath: {
		type: String,
		required: false,
		default: ''
	}
});

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();
const { t } = useI18n();

async function onOKClick() {
	onDialogOK();
}
</script>
<style lang="scss" scoped>
.policy-dialog {
	max-width: 400px;
	width: 400px;
	height: auto;
	background: #fff;
	padding: 0;
	position: relative;

	.policy-dialog-header {
		width: 100%;
		height: 32px;
		background: $grey-1;
		padding-left: 12px;
		padding-right: 12px;
	}

	.policy-content {
		width: 100%;
		height: calc(100% - 32px);
		padding: 20px;

		&__info {
			color: $text2;
		}

		&__image {
			margin-top: 20px;
		}

		.confirm-r-btn {
			height: 32px;
			width: 83px;
		}
	}
}

.q-dialog__inner--minimized > div {
	max-width: 400px;
}

.q-dialog__inner > div {
	border-radius: 12px;
}
</style>
