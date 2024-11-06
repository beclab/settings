import { QVueGlobals } from 'quasar';
import { OperateIntegrationAuth } from '../abstractions/integration/integrationService';
import { AccountType, IntegrationAccountMiniData } from '@bytetrade/core';
import { useDeviceStore } from 'src/stores/device';
import AddTencentDialog from '../../pages/Integration/dialog/AddAccountDialog.vue';
import { useIntegrationStore } from '../../stores/integration';

export class TencentAuthService extends OperateIntegrationAuth {
	type = AccountType.Tencent;

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
					component: AddTencentDialog,
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
