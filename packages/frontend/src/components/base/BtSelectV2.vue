<template>
	<div class="row justify-center items-center">
		<div v-if="selected" class="text-body2 selected-title">
			{{ selected.label }}
		</div>
		<q-btn-dropdown
			class="selected-arrow"
			ref="dropdown"
			dropdown-icon="img:/arrow.svg"
			size="10px"
			flat
			dense
		>
			<q-list style="padding: 8px">
				<template v-for="(item, index) in options" :key="item">
					<div
						class="text-body2"
						:class="
							item.enable
								? item.value === selected.value
									? 'select-item-selected'
									: 'select-item-normal'
								: 'select-item-disable'
						"
						v-close-popup
						:style="{ marginTop: `${index === 0 ? '0' : '4px'}` }"
						@click="onItemClick(item)"
					>
						{{ item.label }}
					</div>
				</template>
			</q-list>
		</q-btn-dropdown>
	</div>
</template>

<script lang="ts" setup>
import { inject, onMounted, PropType, ref } from 'vue';

interface SelectData {
	label: string;
	value: string;
	enable: boolean;
}

const props = defineProps({
	modelValue: {
		type: String,
		require: true
	},
	options: {
		type: Object as PropType<SelectData[]>,
		require: true
	}
});

const selected = ref<SelectData>();
const dropdown = ref();
const setFocused = inject('setFocused') as any;
const setBlured = inject('setBlured') as any;

onMounted(() => {
	if (props.options && props.options.length > 0) {
		selected.value = props.options[0];
	}
	if (setFocused) {
		setFocused(true);
	}
	if (setBlured) {
		setBlured(true);
	}
});

const emit = defineEmits(['update:modelValue']);

const onItemClick = (item: SelectData) => {
	if (item.enable) {
		selected.value = item;
		emit('update:modelValue', item.value);
	}
};
</script>

<style scoped lang="scss">
.selected-title {
	margin-right: 8px;
	text-align: right;
	color: $text1;
}

.selected-arrow {
	width: 20px;
	height: 20px;
}

.select-item-title {
	width: 134px;
	height: 24px;
	padding: 2px 8px;
	border-radius: 4px;
}

.select-item-normal {
	background: #fff;
	color: $text1;
	@extend .select-item-title;
	cursor: pointer;
	text-decoration: none;

	&:hover {
		background: $grey-1;
	}
}

.select-item-disable {
	background: $grey-2;
	color: $grey-5;
	@extend .select-item-title;
}

.select-item-selected {
	background: $blue;
	color: #fff;
	@extend .select-item-title;
	cursor: pointer;
	text-decoration: none;
}
</style>
