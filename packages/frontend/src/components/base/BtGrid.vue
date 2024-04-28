<template>
	<div class="bt-grid-root">
		<slot name="title" />
		<q-separator class="separator-background" />
		<div class="row bt-grid-grid">
			<slot name="grid" />
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.bt-grid-root {
	width: 100%;
	height: auto;
	border: 1px solid $grey-2;
	border-radius: 12px;
	padding: 12px 20px;
	margin-top: 12px;

	.bt-grid-grid {
		margin-top: 8px;
		width: 100%;
		display: grid;
		grid-column-gap: 12px;
		grid-row-gap: 20px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>
