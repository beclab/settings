import { i18n } from 'src/boot/i18n';
import {
	AccountType,
	OperateIntegrationAuth
	// SpaceIntegrationAccount
} from '../abstractions/integration/integrationService';
import { Platform } from 'quasar';

export class SpaceAuthService extends OperateIntegrationAuth {
	type = AccountType.Space;
	async webSupport() {
		return {
			status: false,
			message: i18n.global.t(
				'Due to some restrictions, we do not support binding this type of account in Settings. Please use TermiPass mobile app to complete the account authorization and binding.'
			)
		};
	}

	signIn(options: any) {
		console.log(options);
	}

	detailPath() {
		if (Platform.is.mobile) {
			return '';
		}
		return '/integration/detail/space';
	}
	async permissions() {
		return {
			title: '',
			scopes: []
		};
	}
}
