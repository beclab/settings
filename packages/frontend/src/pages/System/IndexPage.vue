<template>
	<page-title-component :show-back="false" :title="t('system')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<bt-list :style="deviceStore.isMobile ? 'margin-top: 20px' : ''">
			<bt-form-item
				@click="gotoPage('/system/network')"
				:title="t('home_menus.network')"
				:chevron-right="true"
			/>

			<bt-form-item
				:title="'GPU'"
				@click="gotoPage('/system/gpu')"
				:chevron-right="true"
			/>

			<bt-form-item
				:title="t('version')"
				@click="gotoPage('/system/version')"
				:chevron-right="true"
			/>

			<bt-form-item
				:title="t('logs')"
				@click="gotoPage('/system/log')"
				:chevron-right="true"
				:width-separator="false"
			/>
		</bt-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import PageTitleComponent from '../../components/PageTitleComponent.vue';
import BtFormItem from '../../components/base/BtFormItem.vue';
import { useDeviceStore } from '../../stores/device';
import BtList from '../../components/base/BtList.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const deviceStore = useDeviceStore();
const router = useRouter();
const { t } = useI18n();

function gotoPage(path: string) {
	router.push({ path });
}
</script>
