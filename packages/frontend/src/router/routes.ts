import { RouteRecordRaw } from 'vue-router';
// import { Platform } from 'quasar';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				component: () => import('src/pages/RootPage.vue')
			},
			{
				path: '/person',
				component: () => import('src/pages/Person/IndexPage.vue')
			},
			{
				path: 'loginHistory/:name?',
				name: 'loginHistory',
				component: () => import('pages/Person/LoginHistoryPage.vue')
			},
			{
				path: '/active_session',
				component: () =>
					import('src/pages/Person/VaultActivieSession.vue')
			},
			{
				path: '/active_headscale',
				component: () => import('src/pages/Person/HeadScale.vue')
			},
			{
				path: '/sso_token',
				component: () => import('src/pages/Person/SSOToken.vue')
			},
			{
				path: '/authority',
				component: () => import('src/pages/Person/AuthorityPage.vue')
			},
			{
				path: 'appearance',
				component: () => import('src/pages/Appearance/IndexPage.vue')
			},
			{
				path: 'knowledge',
				component: () => import('src/pages/Knowledge/IndexPage.vue')
			},

			/// user management
			{
				path: 'account',
				component: () => import('src/pages/Account/IndexPage.vue')
			},
			{
				path: 'account/info/:name?',
				component: () =>
					import('src/pages/Account/pages/UserInfoPage.vue')
			},
			/// application
			{
				path: 'application',
				component: () => import('src/pages/Application/IndexPage.vue')
			},
			{
				path: 'application/info/:name?',
				component: () =>
					import(
						'src/pages/Application/pages/ApplicationDetailPage.vue'
					)
			},

			{
				path: 'application/secret/:name?',
				component: () =>
					import(
						'src/pages/Application/pages/ApplicationSecretPage.vue'
					)
			},

			{
				path: 'application/entrance/:name/:entrance',
				component: () =>
					import(
						'src/pages/Application/pages/ApplicationEntrancePage.vue'
					)
			},

			{
				path: 'application/domain/:name/:entrance',
				component: () =>
					import(
						'src/pages/Application/pages/ApplicationDomainPage.vue'
					)
			},
			{
				path: 'application/permission/detail',
				component: () =>
					import(
						'src/pages/Application/pages/ApplicationPermissionPage.vue'
					)
			},

			/// service
			// {
			// 	path: '/notification',
			// 	component: () => import('src/pages/Notification/IndexPage.vue')
			// },
			// {
			// 	path: '/notification/email',
			// 	component: () =>
			// 		import('src/pages/Notification/pages/EmailDetailPage.vue')
			// },

			// {
			// 	path: 'upgrade',
			// 	component: () => import('src/pages/Upgrade/IndexPage.vue')
			// },
			{
				path: 'backup',
				component: () => import('src/pages/Backup2/IndexPage.vue')
			},
			{
				path: 'backup/:backup_name/:snapshot_name',
				component: () =>
					import('src/pages/Backup2/pages/BackupSnapshotDetail.vue')
			},
			{
				path: 'backup/:backup_name',
				component: () =>
					import('src/pages/Backup2/pages/BackupDetail.vue')
			},
			{
				path: 'create_backup',
				component: () => import('src/pages/Backup2/pages/BackupNew.vue')
			},
			{
				path: '/integration',
				component: () => import('src/pages/Integration/IndexPage.vue')
			},
			{
				path: '/integration/login/space',
				component: () =>
					import('src/pages/Integration/Space/LoginPage.vue')
			},
			{
				path: '/integration/detail/space',
				component: () =>
					import('src/pages/Integration/AccountDetail.vue')
			},
			{
				path: '/integration/detail/space/:address',
				component: () =>
					import('src/pages/Integration/TerminusSpaceNFTPage.vue')
			},
			{
				path: '/integration/common/detail/:type/:name',
				component: () =>
					import('src/pages/Integration/IntegrationDetailPage.vue')
			},
			{
				path: '/integration/add',
				component: () =>
					import('src/pages/Integration/pages/IntegrationAddPage.vue')
			},
			{
				path: '/integration/account/add',
				component: () =>
					import(
						'src/pages/Integration/pages/AwsAddIntegrationPage.vue'
					)
			},

			//Notification
			{
				path: '/ns',
				component: () => import('pages/Notification/IndexPage.vue'),
				meta: {}
			},
			{
				path: 'job',
				component: () => import('pages/Notification/Job/JobIndex.vue'),
				meta: {}
			},
			{
				path: 'job/:id',
				component: () => import('pages/Notification/Job/JobDetail.vue'),
				meta: {}
			},
			{
				path: 'sender',
				component: () =>
					import('pages/Notification/Sender/SenderIndex.vue'),
				meta: {}
			},
			{
				path: 'sender/create',
				component: () =>
					import('pages/Notification/Sender/SenderTemplate.vue'),
				meta: {}
			},
			{
				path: 'recipients',
				component: () =>
					import('pages/Notification/Recipients/RecipientsIndex.vue'),
				meta: {}
			},
			{
				path: 'recipients/:id',
				component: () =>
					import(
						'pages/Notification/Recipients/RecipientsDetail.vue'
					),
				meta: {}
			},
			{
				path: 'notify',
				component: () =>
					import('pages/Notification/Notify/NotifyIndex.vue'),
				meta: {}
			},
			{
				path: 'notify/:id',
				component: () =>
					import('pages/Notification/Notify/NotifyRule.vue'),
				meta: {}
			},
			{
				path: 'template',
				component: () =>
					import('pages/Notification/Template/TemplateIndex.vue'),
				meta: {}
			},
			{
				path: 'template/:id',
				component: () =>
					import('pages/Notification/Template/TemplateContent.vue'),
				meta: {}
			},
			{
				path: '/system',
				component: () => import('src/pages/System/IndexPage.vue')
			},
			{
				path: '/system/version',
				component: () =>
					import('src/pages/System/pages/VersionPage.vue')
			},
			{
				path: '/system/network',
				component: () =>
					import('src/pages/System/pages/NetworkPage.vue')
			},
			{
				path: '/system/host',
				component: () => import('src/pages/System/pages/HostPage.vue')
			},
			{
				path: '/system/gpu',
				component: () => import('src/pages/System/pages/GPUPage.vue')
			},
			{
				path: '/system/log',
				component: () => import('src/pages/System/pages/LogPage.vue')
			}
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
];

// if (Platform.is.mobile) {
// 	routes.push({
// 		path: '',
// 		component: () => import('layouts/MainLayout.vue'),
// 		children: [
// 			{
// 				path: '',
// 				component: () => import('src/pages/Mobile/RootPage.vue')
// 			}
// 		]
// 	});
// } else {
// 	routes.push({
// 		path: '',
// 		component: () => import('layouts/MainLayout.vue'),
// 		children: [
// 			{
// 				path: '',
// 				component: () => import('src/pages/Person/IndexPage.vue')
// 			}
// 		]
// 	});
// }

export default routes;
