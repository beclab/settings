<template>
	<edit-container>
		<bio-button
			class="q-mt-xl text-body1"
			size="24px"
			:label="t('blocks.add_block')"
			icon="sym_r_add"
			@click="onAddBlock"
		/>
		<vue-draggable-next
			v-if="userStore.user && userStore.user.block.data"
			:list="userStore.user?.block.data"
		>
			<transition-group name="list">
				<template
					v-for="(item, index) in userStore.user?.block.data"
					:key="index"
				>
					<block-item :block="item" />
				</template>
			</transition-group>
		</vue-draggable-next>
	</edit-container>
</template>

<script lang="ts" setup>
import EditContainer from 'src/pages/edit/EditContainer.vue';
import AddBlockDialog from 'src/components/block/AddBlockDialog.vue';
import BioButton from 'src/components/base/BioButton.vue';
import BlockItem from 'src/components/block/BlockItem.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useUserStore } from 'src/stores/user';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

const userStore = useUserStore();
const $q = useQuasar();

const { t } = useI18n();

const onAddBlock = () => {
	$q.dialog({
		component: AddBlockDialog
	})
		.onOk(() => {
			//OK;
		})
		.onCancel(() => {
			//Cancel
		});
};
</script>
<style lang="scss">
.block-button {
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
