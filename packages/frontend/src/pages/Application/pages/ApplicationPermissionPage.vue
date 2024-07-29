<template>
	<page-title-component :show-back="true" :title="title" />

	<bt-scroll-area
		class="nav-height-scroll-area-conf"
		v-if="permissionProviderRegister"
	>
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item :width-separator="false">
				<template v-slot:title>
					<div class="column justify-start">
						<div class="row">
							<div class="text-subtitle2 text-ink-1">
								{{ t('description') }}
							</div>
						</div>
						<div class="text-body3 text-ink-3 q-mt-xs">
							{{ permissionProviderRegister?.description }}
						</div>
					</div>
				</template>
			</bt-form-item>
		</q-list>
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
		>
			<bt-form-item
				:title="t('data_type')"
				:data="permissionProviderRegister?.dataType"
			/>
			<bt-form-item
				:title="t('data_group')"
				:data="permissionProviderRegister?.group"
			/>
			<bt-form-item
				:title="t('version')"
				:data="permissionProviderRegister?.version"
			/>
			<bt-form-item
				:title="t('namespace')"
				:data="permissionProviderRegister?.namespace"
			/>
			<bt-form-item
				:title="t('deployment')"
				:data="permissionProviderRegister?.deployment"
			/>
			<bt-form-item
				:title="t('endpoint')"
				:width-separator="false"
				:data="permissionProviderRegister?.endpoint"
			/>
		</q-list>
		<div
			class="text-subtitle1 details-title"
			v-if="
				permissionProviderRegister?.opApis &&
				permissionProviderRegister?.opApis.length > 0
			"
		>
			{{ t('operations') }}
		</div>
		<q-list
			:class="deviceStore.isMobile ? 'mobile-items-list' : 'q-list-class'"
			v-if="
				permissionProviderRegister?.opApis &&
				permissionProviderRegister?.opApis.length > 0
			"
		>
			<bt-form-item
				v-for="(item, index) in permissionProviderRegister.opApis"
				:key="index"
				:title="item.name"
				:data="item.uri"
				:width-separator="
					index + 1 < permissionProviderRegister.opApis.length
				"
		/></q-list>
	</bt-scroll-area>
	<EmptyComponent
		:info="t('This provider registry could not be found')"
		v-else-if="!$q.loading.isActive && !permissionProviderRegister"
	/>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApplicationStore } from '../../../stores/Application';
import { PermissionProviderRegister } from '../../../global';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { useDeviceStore } from '../../../stores/device';
import BtFormItem from '../../../components/base/BtFormItem.vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import EmptyComponent from '../../../components/EmptyComponent.vue';
const applicationStore = useApplicationStore();
const Route = useRoute();
const permissionProviderRegister = ref<PermissionProviderRegister | undefined>(
	undefined
);
const deviceStore = useDeviceStore();
const { t } = useI18n();
const title = ref(Route.query.title ? Route.query.title : '');
const $q = useQuasar();
const getPermissions = async () => {
	$q.loading.show();
	try {
		permissionProviderRegister.value =
			await applicationStore.getProviderRegistry(Route.query as any);
		$q.loading.hide();
	} catch (error) {
		$q.loading.hide();
	}
};
onMounted(async () => {
	getPermissions();
});
</script>
<style scoped lang="scss">
.details-title {
	margin-top: 20px;
	margin-bottom: 11px;
	color: $ink-1;
}
</style>
