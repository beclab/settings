<template>
	<div class="terminus-edit">
		<div class="text-body3 terminus-edit__label" v-show="label">
			{{ label }}
		</div>
		<div
			class="terminus-edit__bg row wrap justify-between items-center"
			:class="
				isError
					? 'terminus_background_edt_error'
					: isReadOnly
					? 'terminus_background_edt_read_only'
					: 'terminus_background_edt'
			"
			:style="
				(transaction ? 'background : transparent;' : '') +
				(isTextarea ? '' : 'height: 32px;')
			"
		>
			<img
				:src="inputImageRef"
				style="margin-left: 12px"
				v-if="inputImg.length > 0"
			/>
			<q-input
				:model-value="modelValue"
				:type="inputTypeRef"
				class="text-body3 terminus-edit__bg__input"
				:style="isTextarea ? '' : 'margin-top: -8px;'"
				bg-color="transparent"
				:autogrow="isTextarea"
				:placeholder="hintText"
				borderless
				:inputClass="inputClass"
				:input-style="{
					fontWeight: `${
						inputTypeRef === 'password' ? '800' : '400'
					}`,
					fontSize: `${
						inputTypeRef === 'password' && !isMobile
							? '22px'
							: '12px'
					}`,
					maxHeight: isTextarea ? '100px' : ''
				}"
				:readonly="isReadOnly"
				@update:model-value="onTextChange"
				dense
				@keyup.enter="submit"
			>
				<template v-slot:append>
					<q-icon
						size="20px"
						v-if="showPasswordImg"
						:name="
							inputTypeRef === 'password'
								? 'sym_r_visibility_off'
								: 'sym_r_visibility'
						"
						@click="changeInputType"
					/>
					<div v-else>
						<slot name="right"> </slot>
					</div>
				</template>
			</q-input>

			<!-- <div style="position: absolute; right: 0;height: 100%; width: 100px; background: green"/> -->
		</div>
		<div
			class="text-overline terminus-edit__error"
			v-if="errorMessage.length > 0 && isError"
		>
			{{ errorMessage }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	label: {
		type: String,
		default: '',
		require: false
	},
	modelValue: {
		type: String,
		default: '',
		require: false
	},
	isError: {
		type: Boolean,
		default: false,
		require: false
	},
	inputImg: {
		type: String,
		default: '',
		require: false
	},
	hintText: {
		type: String,
		default: '',
		required: false
	},
	showPasswordImg: {
		type: Boolean,
		default: false,
		required: false
	},
	isReadOnly: {
		type: Boolean,
		default: false,
		require: false
	},
	emitKey: {
		type: String,
		default: '',
		require: false
	},
	inputClass: {
		type: String,
		default: 'text-ink-1',
		require: false
	},
	errorMessage: {
		type: String,
		default: '',
		require: false
	},
	transaction: {
		type: Boolean,
		default: false,
		require: false
	},
	isNumber: {
		type: Boolean,
		default: false,
		required: false
	},
	isTextarea: {
		type: Boolean,
		default: false,
		required: false
	}
});

const isMobile = ref(false);
const inputImageRef = ref();
const inputTypeRef = ref<
	| 'text'
	| 'password'
	| 'textarea'
	| 'email'
	| 'search'
	| 'tel'
	| 'file'
	| 'number'
	| 'url'
	| 'time'
	| 'date'
	| undefined
>('text');
if (props.inputImg) {
	inputImageRef.value = require(`../../assets/${props.inputImg}`);
}
if (props.showPasswordImg) {
	inputTypeRef.value = 'password';
}

if (props.isNumber) {
	inputTypeRef.value = 'number';
}

// if (props.isTextarea) {
// 	inputTypeRef.value = 'textarea';
// }

const emit = defineEmits(['onTextChange', 'update:modelValue', 'submit']);

function onTextChange(value: any) {
	if (props.emitKey?.length > 0) {
		emit('onTextChange', props.emitKey, value);
		return;
	}
	emit('update:modelValue', value);
}

function changeInputType() {
	if (inputTypeRef.value === 'text') {
		inputTypeRef.value = 'password';
	} else {
		inputTypeRef.value = 'text';
	}
}
const submit = () => {
	emit('submit');
};
</script>

<style lang="scss" scoped>
.terminus_background_edt {
	background: $background-1;
	backdrop-filter: blur(6.07811px);
	border-radius: 8px;
	border: 1px solid $separator;
}

.terminus_background_edt_error {
	// background: ;
	backdrop-filter: blur(6.07811px);
	border-radius: 8px;
	border: 1px solid $red;
}

.terminus_background_edt_read_only {
	background: linear-gradient(0deg, $background-3, $background-3);
	backdrop-filter: blur(6.07811px);
	border-radius: 8px;
	border: 1px solid $separator;
}

.terminus-edit {
	width: auto;

	&__label {
		color: $ink-2;
	}

	&__bg {
		width: 100%;
		margin-top: 4px;
		position: relative;

		&__input {
			height: 100%;
			width: calc(100% - 30px);
			margin-left: 16px;
			color: $ink-2;
		}
	}

	&__input__less_width {
		width: calc(100% - 64px);
	}

	&__error {
		width: 100%;
		margin-top: 4px;
		color: $red;
	}
}
</style>
