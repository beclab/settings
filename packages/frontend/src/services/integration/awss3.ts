import { QVueGlobals } from 'quasar';
import AddAWSS3Dialog from '../../pages/Integration/dialog/AddAWSS3Dialog.vue';
import {
	AccountType,
	IntegrationAccountMiniData,
	OperateIntegrationAuth
} from '../abstractions/integration/integrationService';
import { useIntegrationStore } from '../../stores/integration';

export class AWSS3AuthService extends OperateIntegrationAuth {
	type = AccountType.AWSS3;

	async webSupport() {
		return {
			status: true,
			message: ''
		};
	}

	signIn(options: any) {
		console.log(options);
		const quasar = options.quasar as QVueGlobals;
		quasar
			.dialog({
				component: AddAWSS3Dialog
			})
			.onOk(() => {
				const integrationStore = useIntegrationStore();
				integrationStore.getAccount('all');
			});
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
