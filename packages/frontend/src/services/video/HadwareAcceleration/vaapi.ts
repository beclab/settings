import {
	HardwareAccelerationTypeClass,
	HardwareDecodingCodeType,
	HardwareDecodingCodeTypeRecord,
	HardwareAccelerationType
} from '../../abstractions/video/service';

export class HardwareVAAPIClass extends HardwareAccelerationTypeClass {
	type = HardwareAccelerationType.Video_Acceleration_API;
	support_enableIntelLowPowerH264HwEncoder = true;
	support_enableIntelLowPowerHevcHwEncoder = true;
	initDecodingCodeList(hardwareDecodingCodecs: string[]) {
		return [
			HardwareDecodingCodeType.H_264,
			HardwareDecodingCodeType.HEVC,
			HardwareDecodingCodeType.MPEG2,
			HardwareDecodingCodeType.VC_1,
			HardwareDecodingCodeType.VP_8,
			HardwareDecodingCodeType.VP_9,
			HardwareDecodingCodeType.AV_1
		].map((item) => {
			return {
				name: HardwareDecodingCodeTypeRecord[item],
				type: item,
				value:
					hardwareDecodingCodecs.find((e) => e == item) != undefined
			};
		});
	}
}
