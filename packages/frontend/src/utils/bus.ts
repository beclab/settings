import { EventBus } from 'quasar';

export const bus = new EventBus();

export enum BUS_EVENT {
	UPDATE_APP_STORE_INFO = 'update_app_store_info',
	APP_BACKEND_ERROR = 'app_backend_error'
}
