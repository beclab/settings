<template>
	<div
		class="settings-title text-h4 text-ink-1 row justify-between items-center"
	>
		Setting
	</div>
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<q-list dense class="mobile-items-list" style="margin-top: 20px">
			<q-item
				class="person-item row justify-start items-center item-padding-zero"
				clickable
				@click="changeItemMenu({ key: '/person' })"
			>
				<q-item-section avatar class="q-pr-none">
					<setting-avatar :size="56" />
				</q-item-section>
				<q-item-section>
					<div
						class="column justify-between"
						style="margin-left: 8px"
					>
						<div class="text-h5-m test-ink-1">
							{{ adminStore.user.name }}
						</div>
						<div class="text-body3-m text-ink-2">
							{{
								'@' +
								adminStore.terminus.terminusName.split('@')[1]
							}}
						</div>
					</div>
				</q-item-section>
				<q-item-section side>
					<q-icon name="sym_r_keyboard_arrow_right" color="ink-1" />
				</q-item-section>
			</q-item>
		</q-list>

		<q-list
			v-for="(list, index) in itemsRef"
			:key="index"
			dense
			class="mobile-items-list"
			style="margin-top: 20px"
		>
			<div v-for="(item, index) in list" :key="item.key">
				<q-item
					class="item-padding-zero"
					style="height: 48px"
					clickable
					@click="changeItemMenu(item)"
				>
					<q-item-section
						avatar
						class="q-pr-none"
						style="min-width: 32px"
					>
						<q-img :src="item.img" width="27px" noSpinner />
					</q-item-section>

					<q-item-section
						class="text-subtitle2-m text-ink-1"
						style="margin-left: 8px"
					>
						{{ item.label }}
					</q-item-section>

					<q-item-section side>
						<q-icon
							name="sym_r_keyboard_arrow_right"
							color="ink-1"
						/>
					</q-item-section>
				</q-item>
				<bt-separator v-if="index + 1 < list.length" />
			</div>
		</q-list>
	</bt-scroll-area>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SettingAvatar from '../components/base/SettingAvatar.vue';
import { useAdminStore } from '../stores/Admin';
import { MENU_TYPE } from '../utils/constants';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { useDeviceStore } from '../stores/device';
import BtSeparator from '../components/base/BtSeparator.vue';

const router = useRouter();
const adminStore = useAdminStore();
const deviceStore = useDeviceStore();

if (deviceStore.isMobile) {
	router.replace('');
} else {
	router.replace('/person');
}

const { t } = useI18n();

const adminMenu = [
	[
		{
			label: t('home_menus.' + MENU_TYPE.Account.toLowerCase()),
			key: '/account',
			img: 'imgs/root/account.svg'
		},
		{
			label: t('home_menus.' + MENU_TYPE.Application.toLowerCase()),
			key: '/application',
			img: 'imgs/root/application.svg'
		},
		{
			label: t('home_menus.' + MENU_TYPE.Integration.toLowerCase()),
			key: '/integration',
			img: 'imgs/root/integration.svg'
		}
	],
	[
		{
			label: t('home_menus.' + MENU_TYPE.Appearance.toLowerCase()),
			key: '/appearance',
			img: 'imgs/root/appearance.svg'
		}
	],
	[
		// {
		// 	label: t('home_menus.' + MENU_TYPE.Backup.toLowerCase()),
		// 	key: '/backup',
		// 	img: 'imgs/root/backup.svg'
		// },
		{
			label: t('home_menus.' + MENU_TYPE.Upgrade.toLowerCase()),
			key: '/upgrade',
			img: 'imgs/root/upgrade.svg'
		}
	]
];

const UserMenu = [
	[
		{
			label: t('home_menus.' + MENU_TYPE.Application.toLowerCase()),
			key: '/application',
			img: 'imgs/root/application.svg'
		},
		{
			label: t('home_menus.' + MENU_TYPE.Integration.toLowerCase()),
			key: '/integration',
			img: 'imgs/root/integration.svg'
		}
	],
	[
		{
			label: t('home_menus.' + MENU_TYPE.Appearance.toLowerCase()),
			key: '/appearance',
			img: 'imgs/root/appearance.svg'
		}
	]
];

const itemsRef = ref<
	{
		label: string;
		key: string;
		img: string;
	}[][]
>([]);

onMounted(() => {
	itemsRef.value = adminStore.isAdmin ? adminMenu : UserMenu;
});

const changeItemMenu = (data: any): void => {
	const type = data.key;
	router.push({ path: type });
};
</script>

<style scoped lang="scss">
.settings-title {
	width: 100%;
	height: 56px;
	padding-left: 16px;
	padding-right: 16px;
	width: 100%;
}
.person-item {
	height: 80px;
	background-color: $background-2;
}
</style>
