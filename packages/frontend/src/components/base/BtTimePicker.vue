<template>
	<div class="time-picker-root row justify-between items-center">
		<q-input
			:disable="inputDisabled"
			class="time-input"
			borderless
			@focus="focusChange(true)"
			@blur="focusChange(false)"
			v-model="valueWithUnit"
			@update:model-value="onInputChange"
		/>
		<div class="time-resize column justify-between items-center">
			<div
				class="icon-parent column justify-center items-center"
				@click="increasePercentage"
				title="increase"
			>
				<q-icon size="8px" name="sym_r_expand_less" />
			</div>
			<div
				class="icon-parent column justify-center items-center"
				@click="decreasePercentage"
				title="decrease"
			>
				<q-icon size="8px" name="sym_r_expand_more" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, inject } from 'vue';

const props = defineProps({
	modelValue: {
		type: Number,
		require: true
	},
	unit: {
		type: String,
		require: true
	},
	max: {
		type: Number,
		default: 100
	},
	min: {
		type: Number,
		default: 0
	},
	inputDisabled: {
		type: Boolean,
		default: true
	}
});
const emit = defineEmits(['onUpdate', 'update:modelValue']);

const unitSign = ref(true);

const setFocused = inject('setFocused');
const setBlured = inject('setBlured') as any;

const focusChange = (focus: boolean) => {
	unitSign.value = !focus;
};

const valueWithUnit = computed({
	get: () => `${props.modelValue}${unitSign.value ? props.unit : ''}`,
	set: (value) => {
		const parsedValue = parseFloat(value);
		console.log(parsedValue);
		emit(
			'update:modelValue',
			isNaN(parsedValue)
				? props.min
				: Math.min(Math.max(parsedValue, props.min), props.max)
		);
	}
});

const onInputChange = (value: string) => {
	console.log(value);
	if (props.unit) {
		const valueWithoutUnitSign = value.replace(props.unit, '');
		emit('onUpdate', valueWithoutUnitSign);
	}
};

const increasePercentage = () => {
	if (props.modelValue !== undefined && props.modelValue < props.max) {
		const value = (props.modelValue + 1).toFixed(0);
		console.log(value);
		valueWithUnit.value = value;
		emit('onUpdate', value);
	}
};

const decreasePercentage = () => {
	if (props.modelValue !== undefined && props.modelValue > props.min) {
		const value = (props.modelValue - 1).toFixed(0);
		valueWithUnit.value = value;
		emit('onUpdate', value);
	}
};

onMounted(() => {
	valueWithUnit.value = `${props.modelValue}${props.unit}`;
	if (setFocused) {
		setFocused(true);
	}
	if (setBlured) {
		setBlured(true);
	}
});
</script>

<style lang="scss">
.time-picker-root {
	width: 60px;
	height: 44px;

	.time-input {
		width: calc(100% - 20px);
		padding-left: 10px;
		padding-right: 10px;
		margin-top: -8px;
	}

	.time-resize {
		height: 20px;
		width: 20px;
		margin-top: -8px;
		border-radius: 4px;
		background: $grey-1;
		cursor: pointer;
		overflow: hidden;
		text-decoration: none;

		.icon-parent {
			width: 20px;
			height: 10px;

			&:hover {
				background: $grey-1;
				filter: brightness(0.9);
			}
		}
	}
}
</style>
