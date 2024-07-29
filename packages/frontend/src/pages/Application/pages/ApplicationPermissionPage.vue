<template>
	<page-title-component :show-back="true" />

	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div class="text-subtitle1 details-title">opApis</div>
		<template
			v-for="(permission, index) in permissionProviderRegister?.opApis"
			:key="index"
		>
			<permission-provider-item
				:title="permission.name"
				:detail="permission.uri"
			/>
		</template>
		{{ JSON.stringify(permissionProviderRegister) }}
	</bt-scroll-area>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApplicationStore } from '../../../stores/Application';
import { PermissionProviderRegister } from '../../../global';
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import PermissionProviderItem from '../../../components/application/PermissionProviderItem.vue';
const applicationStore = useApplicationStore();
const Route = useRoute();
const permissionProviderRegister = ref<PermissionProviderRegister | undefined>(
	undefined
);
const getPermissions = async () => {
	permissionProviderRegister.value =
		await applicationStore.getProviderRegistry(Route.query as any);
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
