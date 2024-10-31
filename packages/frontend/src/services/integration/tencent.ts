import { QVueGlobals } from 'quasar';
// import AddAWSS3Dialog from '../../pages/Integration/dialog/AddAWSS3Dialog.vue';
import {
	AccountType,
	IntegrationAccountMiniData,
	OperateIntegrationAuth
} from '../abstractions/integration/integrationService';
// import { useIntegrationStore } from '../../stores/integration';
// import { useDeviceStore } from 'src/stores/device';

export class TencentAuthService extends OperateIntegrationAuth {
	type = AccountType.Tencent;

	async webSupport() {
		return {
			status: true,
			message: ''
		};
	}

	signIn(options: any) {
		options.quasar as QVueGlobals;
		console.log(options);
		// const router = options.router;
		// const deviceStore = useDeviceStore();
		// if (deviceStore.isMobile) {
		// 	router.push('/integration/aws/add');
		// } else {
		// 	quasar
		// 		.dialog({
		// 			component: AddAWSS3Dialog
		// 		})
		// 		.onOk(() => {
		// 			const integrationStore = useIntegrationStore();
		// 			integrationStore.getAccount('all');
		// 		});
		// }
	}

	detailPath(account: IntegrationAccountMiniData) {
		return (
			'/integration/common/detail/' + account.type + '/' + account.name
		);
	}

	async permissions() {
		return {
			title: '',
			scopes: []
		};
	}
}
