import {
	BackupLocation,
	BackupFrequency,
	BackupSnapshotPhase
} from '@bytetrade/core';

import { i18n } from '../boot/i18n';

export enum MENU_TYPE {
	Wallpaper = 'Wallpaper',
	Knowledge = 'Knowledge',
	Notification = 'Notification',
	Application = 'Application',
	Integration = 'Integration',
	Account = 'Account',
	Services = 'Services',
	Authority = 'Authority',
	Upgrade = 'Upgrade',
	Backup = 'Backup',
	Appearance = 'Appearance',
	Video = 'Video'
}

export function getRoleName(role: string) {
	if (role === 'workspaces-manager') {
		return i18n.global.t('role.member');
	} else if (role === 'platform-admin') {
		return i18n.global.t('role.admin');
	}
	return role;
}

export interface EntrancePolicy {
	one_time: boolean;
	policy: string;
	uri: string;
	valid_duration: number;
}

export const locationOptions = [
	{
		label: i18n.global.t('server_location.terminus_space'),
		value: BackupLocation.TerminusCloud,
		enable: true
	},
	{
		label: i18n.global.t('server_location.aws_s3'),
		value: BackupLocation.S3,
		enable: false
	}
];

export const frequencyOptions = [
	{
		label: i18n.global.t('frequencys.every_day'),
		value: BackupFrequency.Daily,
		enable: true
	},
	{
		label: i18n.global.t('frequencys.every_week'),
		value: BackupFrequency.Weekly,
		enable: true
	}
];

export const weekOption = [
	{
		label: i18n.global.t('week.sunday'),
		value: 0,
		enable: true
	},
	{
		label: i18n.global.t('week.monday'),
		value: 1,
		enable: true
	},
	{
		label: i18n.global.t('week.tuesday'),
		value: 2,
		enable: true
	},
	{
		label: i18n.global.t('week.wednesday'),
		value: 3,
		enable: true
	},
	{
		label: i18n.global.t('week.thursday'),
		value: 4,
		enable: true
	},
	{
		label: i18n.global.t('week.friday'),
		value: 5,
		enable: true
	},
	{
		label: i18n.global.t('week.saturday'),
		value: 6,
		enable: true
	}
];

export enum FACTOR_MODEL {
	One = 'one_factor',
	Two = 'two_factor',
	Public = 'public'
}

export const factorModelOptions = [
	{
		label: i18n.global.t('factor.one_factor'),
		value: FACTOR_MODEL.One,
		enable: true
	},
	{
		label: i18n.global.t('factor.two_factor'),
		value: FACTOR_MODEL.Two,
		enable: true
	},
	{
		label: i18n.global.t('factor.public'),
		value: FACTOR_MODEL.Public,
		enable: true
	}
];

export enum AUTH_LEVEL {
	Private = 'private',
	Public = 'public'
}

export const authLevelOptions = [
	{
		label: 'Private',
		value: AUTH_LEVEL.Private,
		enable: true
	},
	{
		label: 'Public',
		value: AUTH_LEVEL.Public,
		enable: true
	}
];

export interface Secret {
	Key: string; //  key name
	Workspace: string; // secret workspace name
}

export interface ThirdPartyAccountInterface {
	name: string;
	icon: string;
	email: string;
}

export const ThirdPartyAccountList: ThirdPartyAccountInterface[] = [
	{
		name: 'Google',
		icon: 'Google',
		email: ''
	},
	{
		name: 'iCloud',
		icon: 'iCloud',
		email: ''
	},
	{
		name: 'Yahoo',
		icon: 'Yahoo',
		email: ''
	},
	{
		name: 'Aol',
		icon: 'Aol',
		email: ''
	}
];

export const BackupSnapshotPhaseColorRecord: Record<
	BackupSnapshotPhase,
	string
> = {
	[BackupSnapshotPhase.Canceled]: '#ADADAD',
	[BackupSnapshotPhase.Pending]: '#FEBE01',
	[BackupSnapshotPhase.Running]: '#29CC5F',
	[BackupSnapshotPhase.Failed]: '#FF4D4D',
	[BackupSnapshotPhase.Started]: '#3377FF',
	[BackupSnapshotPhase.Succeed]: '#3377FF'
};

export enum MODEL_STATUS {
	//server
	running = 'running',
	installed = 'installed',
	noInstalled = 'no_installed',
	installing = 'installing',

	//local
	pending = 'pending',
	loading = 'loading',
	stopping = 'stopping',
	uninstalling = 'uninstalling',
	installable = 'installable'
}

export interface DifyModelInfo {
	id: string;
	file_name: string;
	progress: number;
	status: MODEL_STATUS;
	folder_path: string;
	model: ModelInfo;
	type: string;
}

export interface ModelMetadata {
	author: string;
	cover: string;
	size: number;
	tags: string[];
}

export interface ModelRuntimeParams {
	frequency_penalty: number;
	max_tokens: number;
	presence_penalty: number;
	stop: any[];
	stream: boolean;
	temperature: number;
	top_p: number;
}

export interface ModelSettingParams {
	ctx_len: number;
	prompt_template: string;
}

export interface ModelInfo {
	object: string;
	format: string;
	source_url: string;
	id: string;
	name: string;
	created: number;
	description: string;
	settings: ModelSettingParams;
	parameters: ModelRuntimeParams;
	metadata: ModelMetadata;
	engine: string;
}

export enum QR_STATUS {
	NORMAL,
	EXPIRED,
	SUCCESSFUL
}

export function getSecondLevelDomain() {
	const domainParts = window.location.hostname.split('.');
	if (domainParts.length >= 3) {
		return domainParts.slice(-3).join('.');
	} else {
		return window.location.hostname;
	}
}

export enum ConfirmButtonStatus {
	normal = 1,
	error = 2,
	disable = 3
}
