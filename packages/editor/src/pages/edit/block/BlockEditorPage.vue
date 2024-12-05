<template>
	<edit-container>
		<div class="column">
			<div
				class="row justify-start items-center cursor-pointer text-ink-1 q-my-xl"
				@click="onBack"
			>
				<q-icon name="sym_r_arrow_back_ios_new" style="margin: 6px" />
				<div class="text-subtitle2">{{ t('base.back') }}</div>
			</div>
			<text-block-editor v-if="blockType === BLOCK_TYPE.TEXT" />
			<link-block-editor v-if="blockType === BLOCK_TYPE.LINK" />
			<image-block-editor v-if="blockType === BLOCK_TYPE.IMAGE" />
		</div>
	</edit-container>
</template>

<script lang="ts" setup>
import ImageBlockEditor from 'src/pages/edit/block/ImageBlockEditor.vue';
import TextBlockEditor from 'src/pages/edit/block/TextBlockEditor.vue';
import LinkBlockEditor from 'src/pages/edit/block/LinkBlockEditor.vue';
import EditContainer from 'src/pages/edit/EditContainer.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user';
import { BLOCK_TYPE } from 'src/types/User';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const onBack = () => {
	router.back();
};
const blockType = ref();

const userStore = useUserStore();
onMounted(() => {
	console.log(route.params.id);
	if (route.params.id && userStore.user) {
		const block = userStore.user.block.data.find((item) => {
			return item.id === route.params.id;
		});
		console.log(block);
		if (block) {
			blockType.value = block.type;
		}
	}
});
</script>
<style lang="scss" />
