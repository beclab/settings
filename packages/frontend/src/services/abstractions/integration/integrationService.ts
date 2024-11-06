import {
	AccountType,
	GoogleIntegrationAccountData,
	IntegrationAccountBaseData,
	SpaceIntegrationAccountData,
	AWSS3IntegrationAccountData,
	TencentIntegrationAccountData,
	IntegrationAccountMiniData
} from '@bytetrade/core';

export interface IntegrationAccount {
	name: string;
	type: AccountType;
	raw_data: IntegrationAccountBaseData;
}

export interface GoogleIntegrationAccount extends IntegrationAccount {
	raw_data: GoogleIntegrationAccountData;
}

export interface SpaceIntegrationAccount extends IntegrationAccount {
	raw_data: SpaceIntegrationAccountData;
}

export interface AWSS3IntegrationAccount extends IntegrationAccount {
	raw_data: AWSS3IntegrationAccountData;
}

export interface TencentIntegrationAccount extends IntegrationAccount {
	raw_data: TencentIntegrationAccountData;
}

export interface IntegrationAuthResult {
	status: boolean;
	account?: IntegrationAccount;
	message: string;
}

export interface IntegrationAccountInfoDetail {
	name: string;
	icon: string;
}

export interface IntegrationAccountInfo {
	type: AccountType;
	detail: IntegrationAccountInfoDetail;
}

export interface IntegrationWebSupportAuth {
	status: boolean;
	message: string;
}

export interface IntegrationScopesDetail {
	icon: string;
	introduce: string;
}

export interface IntegrationPermissions {
	title: string;
	scopes: IntegrationScopesDetail[];
}

export abstract class OperateIntegrationAuth {
	type: AccountType;
	abstract webSupport(): Promise<IntegrationWebSupportAuth>;
	abstract signIn(options: any): void;
	abstract detailPath(account: IntegrationAccountMiniData): string;
	abstract permissions(): Promise<IntegrationPermissions>;
}

export interface IntegrationService {
	supportAuthList: IntegrationAccountInfo[];
	getAccountByType(
		request_type: AccountType
	): IntegrationAccountInfo | undefined;
	getInstanceByType(
		request_type: AccountType
	): OperateIntegrationAuth | undefined;
	webSupport(request_type: AccountType): Promise<IntegrationWebSupportAuth>;
}
