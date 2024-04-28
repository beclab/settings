<template>
	<div class="bottom-root">
		<q-btn
			:class="getCurrentStatusClass()"
			flat
			padding="0px"
			@click="confirmAction()"
			:disable="btnStatus === ConfirmButtonStatus.disable"
			no-caps
			class="row items-center justify-center"
		>
			<q-icon
				v-if="btnIcon.length"
				:name="btnIcon"
				size="20px"
				class="q-mr-sm text-text1"
			/>
			<div>
				{{ btnTitle.length > 0 ? btnTitle : t('confirm') }}
			</div>
		</q-btn>
	</div>
</template>

<script setup lang="ts">
import { ConfirmButtonStatus } from '../../utils/constants';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	btnTitle: {
		type: String,
		required: false,
		default: ''
	},
	btnStatus: {
		type: Number,
		required: false,
		default: ConfirmButtonStatus.normal
	},
	bgClasses: {
		type: String,
		required: false,
		default: 'bg-color-yellow'
	},
	textClasses: {
		type: String,
		required: false,
		default: 'text-color-title'
	},
	btnIcon: {
		type: String,
		required: false,
		default: ''
	}
});

const { t } = useI18n();

const confirmAction = () => {
	if (props.btnStatus === ConfirmButtonStatus.error) {
		emit('onError');
	} else if (props.btnStatus === ConfirmButtonStatus.normal) {
		emit('onConfirm');
	}
};
const emit = defineEmits(['onConfirm', 'onError']);

const getCurrentStatusClass = () => {
	const classes = [props.textClasses];

	classes.push('text-body2 confirm-btn-desktop');

	if (props.btnStatus === ConfirmButtonStatus.error) {
		classes.push('bg-color-error');
	}

	if (props.btnStatus === ConfirmButtonStatus.normal) {
		classes.push('bg-color-normal');
		classes.push(props.bgClasses);
	}

	if (props.btnStatus === ConfirmButtonStatus.disable) {
		classes.push('bg-color-disable');
	}

	return classes.join(' ');
};
</script>

<style lang="scss" scoped>
.bottom-root {
	height: 36px;
	width: 100%;
	border-radius: 8px;

	.confirm-btn-desktop {
		width: 100%;
		height: 100%;
		border-radius: 8px;
		color: #fff;
	}

	.bg-color-normal {
		background-color: $blue;
	}

	.bg-color-disable {
		background-color: $blue;
	}

	.bg-color-error {
		background-color: $red;
	}
}
</style>
