<template>
	<page-title-component :show-back="true" :title="t('export_ports')" />

	<bt-scroll-area v-if="application" class="nav-height-scroll-area-conf">
		<template v-for="(port, index) in application.ports" :key="index">
			<bt-list>
				<bt-form-item
					:title="t('name')"
					:width-separator="true"
					:data="port.name"
				/>

				<bt-form-item
					:title="t('host')"
					:width-separator="true"
					:data="port.host"
				/>

				<bt-form-item
					:title="t('port')"
					:width-separator="true"
					:data="port.port"
				/>

				<bt-form-item
					:title="t('export_port')"
					:width-separator="true"
					:data="port.exposePort"
				/>

				<bt-form-item
					:title="t('protocol')"
					:width-separator="false"
					:data="port.protocol"
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
import { ref } from 'vue';
import { useApplicationStore } from '../../../stores/application';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const applicationStore = useApplicationStore();
const route = useRoute();

const application = ref(
	applicationStore.getApplicationById(route.params.name as string)
);
</script>

<style scoped lang="scss"></style>
