<template>
	<div class="form-item-root column justify-start">
		<q-item
			:clickable="chevronRight"
			class="form-item"
			:style="marginTop ? 'margin-top: 4px' : ''"
		>
			<q-item-section class="text-body2 form-item-title" v-if="title">
				{{ title }}
			</q-item-section>
			<q-item-section class="text-body2 form-item-title" v-else>
				<slot name="title" />
			</q-item-section>
			<q-item-section side>
				<div class="text-body2 form-item-data" v-if="data">
					{{ data }}
				</div>
				<q-icon
					v-else-if="chevronRight"
					name="sym_r_chevron_right"
					size="20px"
				/>
				<slot v-else />
			</q-item-section>
		</q-item>
		<q-separator class="separator-background" v-if="widthSeparator" />
	</div>
</template>

<script lang="ts" setup>
defineProps({
	title: {
		type: String,
		required: false,
		default: ''
	},
	data: {
		type: String,
		require: false
	},
	chevronRight: {
		type: Boolean,
		default: false
	},
	widthSeparator: {
		type: Boolean,
		default: true
	},
	marginTop: {
		type: Boolean,
		default: true
	}
});
</script>

<style scoped lang="scss">
.form-item-root {
	width: 100%;
	height: auto;

	.form-item {
		height: 52px;
		min-height: 52px;
		padding: 0;

		.form-item-title {
			color: $ink-1;
		}

		.form-item-data {
			text-align: right;
			color: $ink-2;
		}
	}
}
</style>
