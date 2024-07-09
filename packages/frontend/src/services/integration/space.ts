import {
	AccountType,
	OperateIntegrationAuth
	// SpaceIntegrationAccount
} from '../abstractions/integration/integrationService';

export class SpaceAuthService extends OperateIntegrationAuth {
	type = AccountType.Space;
	async webSupport() {
		return {
			status: false,
			message:
				'Due to some restrictions, we do not support binding this type of account in Settings. Please use TermiPass mobile app to complete the account authorization and binding.'
		};
	}

	signIn(options: any) {
		console.log(options);
	}

	detailPath() {
		return '/integration/detail/space';
	}
	async permissions() {
		return {
			title: '',
			scopes: []
		};
	}
}
