import { QVueGlobals } from 'quasar';
import AddAWSS3Dialog from '../../pages/Integration/dialog/AddAccountDialog.vue';
import { OperateIntegrationAuth } from '../abstractions/integration/integrationService';
import { useIntegrationStore } from '../../stores/integration';
import { useDeviceStore } from 'src/stores/device';
import { AccountType, IntegrationAccountMiniData } from '@bytetrade/core';

export class AWSS3AuthService extends OperateIntegrationAuth {
	type = AccountType.AWSS3;

	async webSupport() {
		return {
			status: true,
			message: ''
		};
	}

	signIn(options: any) {
		const quasar = options.quasar as QVueGlobals;
		const router = options.router;
		const deviceStore = useDeviceStore();
		if (deviceStore.isMobile) {
			router.push({
				path: '/integration/account/add',
				query: {
					accountType: this.type
				}
			});
		} else {
			quasar
				.dialog({
					component: AddAWSS3Dialog,
					componentProps: {
						accountType: this.type
					}
				})
				.onOk(() => {
					const integrationStore = useIntegrationStore();
					integrationStore.getAccount('all');
				});
		}
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
