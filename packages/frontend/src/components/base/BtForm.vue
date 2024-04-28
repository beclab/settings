<template>
	<div class="column" style="width: 100%; height: auto">
		<slot />
	</div>
</template>

<script lang="ts" setup>
import { ref, provide, nextTick } from 'vue';

defineProps({
	canSubmit: {
		type: Boolean,
		default: false
	}
});

const childComponents = ref<any[]>([]);
const emit = defineEmits(['update:canSubmit']);

const addChildComponent = (componentRef: any) => {
	childComponents.value.push(componentRef);
};

const executeCheck = async () => {
	let isOK = true;
	console.log('childComponents.value.length');
	console.log(childComponents.value);

	await nextTick(() => {
		childComponents.value.forEach((item) => {
			console.log('item' + item.value.exposed.getErrorStatus());
			console.log(item.value);

			if (item.value.exposed.getErrorStatus()) {
				isOK = false;
			}
		});
	});
	emit('update:canSubmit', isOK);
};

const onErrorStatusChange = (isError: boolean) => {
	if (isError) {
		console.log(false);
		emit('update:canSubmit', false);
	} else {
		executeCheck();
	}
};

provide('addChildComponent', addChildComponent);
provide('onErrorStatusChange', onErrorStatusChange);
</script>

<style scoped lang="scss"></style>
