<template>
	<div class="integration-add-root">
		<page-title-component :title="t('add_account')" />
		<bt-scroll-area class="nav-height-scroll-area-conf">
			<IntegrationAddList
				@itemClick="accountCreate"
				:select-enable="false"
			/>
		</bt-scroll-area>
	</div>
</template>

<script setup lang="ts">
import PageTitleComponent from '../../../components/PageTitleComponent.vue';
import { useI18n } from 'vue-i18n';
import integrationService from '../../../services/integration/index';
import { IntegrationAccountInfo } from '../../../services/abstractions/integration/integrationService';
import { useQuasar } from 'quasar';
import IntegrationAddList from '../components/IntegrationAddList.vue';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const $q = useQuasar();
const router = useRouter();

const accountCreate = async (item: IntegrationAccountInfo) => {
	integrationService.getInstanceByType(item.type)?.signIn({
		quasar: $q,
		router
	});
};
</script>

<style scoped lang="scss">
.integration-add-root {
	width: 100%;
	height: 100%;
}
</style>
