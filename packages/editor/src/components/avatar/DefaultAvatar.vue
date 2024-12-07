<template>
	<bt-scroll-area class="default-avatar-scroll">
		<div class="default-avatar-grid">
			<template v-for="item in avatarArray" :key="item">
				<bio-avatar-selector
					:src="'/avatar/' + item"
					:selected="modelValue.avatar === item"
					@click="onItemClick(item)"
				/>
			</template>
		</div>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import BioAvatarSelector from 'src/components/base/BioAvatarSelector.vue';
import { bus } from 'src/utils/bus';
import { onMounted, ref } from 'vue';

defineProps({
	modelValue: {
		type: Object,
		required: true
	}
});

const avatarArray = ref<string[]>([]);
const emit = defineEmits(['update:modelValue']);

onMounted(() => {
	for (let i = 1; i <= 36; i++) {
		//avatarArray.value.push(`https://file.bttcdn.com/avatar3/${i}.png`);
		avatarArray.value.push('' + i + '.png');
	}

	// emit('update:modelValue', avatarArray.value[0]);
});

const onItemClick = (path: string) => {
	//emit('update:modelValue', path);
	bus.emit('choice', { imageUrl: '/avatar/' + path, avatar: path });
};
</script>

<style scoped lang="scss">
.default-avatar-scroll {
	width: 100%;
	height: 100%;

	.default-avatar-grid {
		padding: 20px;
		width: 100%;
		height: 100%;
		display: grid;
		align-items: center;
		justify-items: center;
		justify-content: center;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		grid-row-gap: 10px;
		grid-column-gap: 10px;
	}
}
</style>
