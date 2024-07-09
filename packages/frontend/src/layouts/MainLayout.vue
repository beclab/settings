<template>
	<q-layout class="main-layout row items-center justify-evenly">
		<div class="settings_box">
			<div class="settings_left">
				<bt-menu
					active-class="my-active-link"
					:items="itemsRef"
					v-model="itemMenu"
					@select="changeItemMenu"
				>
					<template v-slot:header>
						<q-item
							:clickable="itemMenu !== '/'"
							:active="itemMenu === '/'"
							@click="changeItemMenu({ key: '/' })"
							active-class="my-active-link"
							class="person-item row justify-start items-center"
						>
							<setting-avatar
								:size="40"
								style="margin-left: 8px"
							/>
							<div
								class="column justify-between"
								style="margin-left: 8px"
							>
								<div
									class="text-subtitle1 person-name"
									:class="
										itemMenu === '/'
											? 'text-blue-default'
											: 'text-ink-1'
									"
								>
									{{ adminStore.user.name }}
								</div>
								<div
									class="text-body3 person-id"
									:class="
										itemMenu === '/'
											? 'text-blue-default'
											: 'text-ink-2'
									"
								>
									{{
										'@' +
										adminStore.terminus.terminusName.split(
											'@'
										)[1]
									}}
								</div>
							</div>
						</q-item>
					</template>
				</bt-menu>
			</div>
			<div class="settings_content">
				<q-page-container class="settings_content_view">
					<router-view />
				</q-page-container>
			</div>
		</div>
	</q-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '../stores/Admin';
import { MENU_TYPE } from '../utils/constants';
import SettingAvatar from '../components/base/SettingAvatar.vue';
import { useI18n } from 'vue-i18n';
import '../css/common.scss';

const router = useRouter();
const route = useRoute();
const adminStore = useAdminStore();

const { t } = useI18n();

const adminMenu = [
	{
		label: '',
		key: 'Settings',
		children: [
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
			},
			{
				label: t('home_menus.' + MENU_TYPE.Appearance.toLowerCase()),
				key: '/appearance',
				img: 'imgs/root/appearance.svg'
			},
			// {
			// 	label: t('home_menus.' + MENU_TYPE.Knowledge.toLowerCase()),
			// 	key: '/knowledge',
			// 	img: 'imgs/root/knowledge.svg'
			// },
			// {
			// 	label: t('home_menus.' + MENU_TYPE.Notification.toLowerCase()),
			// 	key: '/ns',
			// 	img: 'imgs/root/background.svg'
			// },
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
	}
];

const UserMenu = [
	{
		label: '',
		key: 'Settings',
		children: [
			{
				label: t('home_menus.' + MENU_TYPE.Application.toLowerCase()),
				key: '/application',
				img: 'imgs/root/application.svg'
			},
			{
				label: t('home_menus.' + MENU_TYPE.Integration.toLowerCase()),
				key: '/integration',
				img: 'imgs/root/integration.svg'
			},
			{
				label: t('home_menus.' + MENU_TYPE.Wallpaper.toLowerCase()),
				key: '/wallpaper',
				img: 'imgs/root/wallpaper.svg'
			},
			{
				label: t('home_menus.' + MENU_TYPE.Knowledge.toLowerCase()),
				key: '/knowledge',
				img: 'imgs/root/background.svg'
			}
			// {
			// 	label: t('home_menus.' + MENU_TYPE.Notification.toLowerCase()),
			// 	key: '/ns',
			// 	img: 'imgs/root/background.svg'
			// }
		]
	}
];

const itemsRef = ref();

const itemMenu = ref('/');

const changeItemMenu = (data: any): void => {
	const type = data.key;
	itemMenu.value = type;
	router.push({ path: type });
};

if (location.pathname === '/') {
	itemMenu.value = '/';
	router.push({ path: '/' });
}

onMounted(() => {
	itemsRef.value = adminStore.isAdmin ? adminMenu : UserMenu;
	if (itemsRef.value.length > 0) {
		const finditem = itemsRef.value[0].children.find((e: { key: string }) =>
			route.path.startsWith(e.key as string)
		);
		if (finditem) {
			itemMenu.value = finditem.key;
		}
	}
});
</script>

<style lang="scss" scoped>
.settings_box {
	width: 858px;
	max-width: 858px;
	min-width: 858px;
	height: 100vh;
	display: flex;
	align-content: center;
	justify-content: center;
	border-radius: 8px;
	overflow: hidden;

	.settings_left {
		width: 240px;
		height: 100%;
		border-right-width: 1px;
		border-right: $separator;
		border-right-style: solid;

		.person-item {
			height: 48px;
			width: 100%;
			padding: 0;
			border-radius: 8px;
			.person-avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-top: 0;
			}
		}
	}

	.settings_content {
		width: calc(100% - 200px);
		height: 100%;

		.settings_content_view {
			// background: white;
			overflow: hidden;
			height: 100%;
			width: 100%;
			padding: 0;
		}
	}
}

.main-layout::v-deep .my-active-link {
	color: $blue-default;
	background-color: $blue-alpha;
}

.main-layout {
	background-color: $background-1;
}
</style>
