<template>
	<page-title-component :show-back="true" :title="t('acls')" />

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<template v-for="(item, index) in aclStore.appAclList" :key="index">
			<bt-list>
				<bt-form-item :title="t('dst')">
					<div class="dst-grid row justify-end items-center">
						<template v-for="dst in item.dst" :key="dst">
							<div class="acl-dst text-caption text-ink-2">
								{{ dst }}
							</div>
						</template>
					</div>
				</bt-form-item>
				<bt-form-item
					:width-separator="false"
					:title="t('protocol')"
					:data="item.proto"
				/>
			</bt-list>
		</template>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import BtList from '../../../components/base/BtList.vue';
import { useAclStore } from '../../../stores/acl';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const aclStore = useAclStore();
const route = useRoute();

onMounted(() => {
	if (route.params.name) {
		aclStore.getAppAclStatus(route.params.name as string);
	}
});
</script>

<style scoped lang="scss">
.dst-grid {
	max-width: 100%;
	padding-top: 14px;
	padding-bottom: 14px;
	gap: 10px;
	text-align: right;

	.acl-dst {
		height: 20px;
		padding: 4px 12px;
		border-radius: 20px;
		border: 1px solid $separator;
	}
}
</style>
