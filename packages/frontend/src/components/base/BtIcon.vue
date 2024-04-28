<template>
	<q-icon
		class="cursor-pointer bt-icon-background text-grey-8"
		:name="`sym_r_${name}`"
		size="20px"
	/>
</template>

<script lang="ts" setup>
defineProps({
	name: {
		type: String,
		require: true
	}
});
</script>

<style scoped lang="scss">
.bt-icon-background {
	background: $grey-1;
	border-radius: 4px;

	&:hover {
		filter: brightness(0.9);
	}
}
</style>
