<template>
	<q-dialog ref="dialogRef">
		<div class="common-dialog policy-dialog" style="border-radius: 16px">
			<DialogHeader :title="title" @close-action="onDialogCancel" />
			<div class="policy-content column justify-start">
				<div class="text-body3 policy-content__info">
					{{ info }}
				</div>
				<q-img
					class="policy-content__image"
					:src="imagePath"
					v-if="imagePath && imagePath.length"
				/>
				<dialog-footer
					:confirm-text="t('confirm')"
					:hasCancel="false"
					@cancel-action="onDialogCancel"
					@confirm-action="onOKClick"
				/>
			</div>
		</div>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { useI18n } from 'vue-i18n';
import DialogHeader from '../DialogHeader.vue';
import DialogFooter from '../DialogFooter.vue';

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
	height: auto;
	padding: 0;
	position: relative;

	.policy-dialog-header {
		width: 100%;
		height: 32px;
		padding-left: 12px;
		padding-right: 12px;
	}

	.policy-content {
		width: 100%;
		height: calc(100% - 32px);
		padding: 20px;

		&__info {
			color: $ink-2;
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
