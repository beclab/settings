import { boot } from 'quasar/wrappers';
import BytetradeUi, { BtNotify, BtDialog } from '@bytetrade/ui';
import { Notify, Dialog } from 'quasar';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
	// something to do
	BtNotify.init(Notify);
	BtDialog.init(Dialog);
	app.use(BytetradeUi);
});
