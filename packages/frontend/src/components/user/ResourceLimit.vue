<template>
	<div class="resource-limit-root row justify-between">
		<div class="column justify-between">
			<div class="text-subtitle1 resource-label">{{ label }}</div>
			<div class="text-h5 resource-value">
				{{ usageFormat }}/{{ totalFormat }}
			</div>
		</div>
		<q-knob
			readonly
			v-model="percent"
			show-value
			size="56px"
			:thickness="0.4"
			:color="progressColor"
			track-color="grey-1"
			class="text-subtitle3 knob-class"
			:style="{ '--textColor': textColor }"
		>
			{{ percent }}%
		</q-knob>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getValueByUnit, getSuitableUnit } from '../../utils/monitoring';

const props = defineProps({
	total: Number,
	usage: Number,
	label: String,
	unitKey: String
});

const totalFormat = computed(() => {
	if (props.unitKey == 'cpu') {
		if (!props.total) {
			return 'NaN';
		}
		if (typeof props.total == 'string') {
			return Number(parseFloat(props.total as any).toFixed(2));
		}
		return Number(props.total.toFixed(2));
	}
	return getValueByUnit(
		`${props.total}`,
		getSuitableUnit(props.total, props.unitKey as any)
	);
});

const usageFormat = computed(() => {
	if (props.unitKey == 'cpu') {
		if (!props.usage) {
			return 'NaN';
		}
		if (typeof props.usage == 'string') {
			return Number(parseFloat(props.usage as any).toFixed(2));
		}
		return Number(props.usage.toFixed(2));
	}
	return getValueByUnit(
		`${props.usage}`,
		getSuitableUnit(props.usage, props.unitKey as any)
	);
});

const percent = computed(() => {
	if (!props.total || !props.usage) {
		return 0;
	}
	return Number(((props.usage / props.total) * 100).toFixed(0));
});

const progressColor = computed(() => {
	if (percent.value <= 50) {
		return 'color-knob-green';
	} else if (percent.value <= 80) {
		return 'color-knob-yellow';
	} else {
		return 'color-knob-red';
	}
});

const textColor = computed(() => {
	if (percent.value <= 50) {
		return '#29CC5F';
	} else if (percent.value <= 80) {
		return '#FEBE01';
	} else {
		return '#FF4D4D';
	}
});
</script>

<style scoped lang="scss">
.resource-limit-root {
	width: 100%;
	border-radius: 20px;
	border: 1px solid $grey-2;
	padding: 20px;
	height: 96px;

	.resource-label {
		color: $grey;
	}

	.resource-value {
		margin-top: 4px;
		color: $text1;
	}

	.knob-class {
		color: $text2;
	}
}
</style>
