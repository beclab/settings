<template>
	<q-card class="bt-dialog">
		<div class="bt-dialog-header row justify-between items-center">
			<div class="text-subtitle3">{{ title }}</div>
			<q-icon
				size="16px"
				name="sym_r_clear"
				color="grey-8"
				@click="emit('onCancel')"
			/>
		</div>
		<div class="bt-dialog-content column justify-start">
			<slot />

			<div class="row justify-end" style="margin-top: 12px">
				<q-btn
					dense
					style="margin-right: 12px"
					class="submit-btn"
					text-color="black"
					:label="t('cancel')"
					@click="emit('onCancel')"
					color="white"
				/>

				<q-btn
					dense
					class="submit-btn"
					:disable="!confirmClickAble"
					:label="t('confirm')"
					@click="emit('onConfirm')"
					color="primary"
				/>
			</div>
		</div>
	</q-card>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

defineProps({
	title: {
		type: String,
		require: true
	},
	confirmClickAble: {
		type: Boolean,
		default: true
	}
});

const { t } = useI18n();

const emit = defineEmits(['onCancel', 'onConfirm']);
</script>
<style lang="scss">
.bt-dialog {
	max-width: 400px;
	width: 400px;
	height: auto;
	background: #fff;
	padding: 0;
	position: relative;

	.bt-dialog-header {
		width: 100%;
		height: 32px;
		background: $grey-1;
		padding-left: 12px;
		padding-right: 12px;
	}

	.bt-dialog-content {
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
