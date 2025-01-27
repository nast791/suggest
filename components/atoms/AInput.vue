<template>
	<div class="input" :class="[props.error && 'error']">
		<input
			ref="input"
			:value="props.modelValue"
			:required="props.required"
			@input="inputHandler"
			v-bind="$attrs"
		>
	</div>
</template>

<script setup>
import {debounce} from "@/utils/funcs";
import {onMounted} from "vue";

const props = defineProps({
	modelValue: {
		type: [String, Number, null],
		required: true
	},
	error: Boolean,
	required: {
		type: Boolean,
		default: false
	},
	focus: {
		type: Boolean,
		default: false
	},
	delay: {
		type: Number,
		default: 0
	}
});

const input = ref(null);

const emits = defineEmits(['update:modelValue', 'update:error']);

const setErrors = (val) => {
	if (props.required && !val) {
		emits('update:error', true);
	} else {
		emits('update:error', false);
	}
};

const update = async (e) => {
	let input = e.target;
	let value = input.value;
	setErrors(value);
	emits('update:modelValue', value ? value : null);
};

const debounceFunc = debounce(update, props.delay);

const inputHandler = (e) => {
	if (props.delay) {
		debounceFunc(e);
	} else {
		update(e);
	}
};

onMounted(() => {
	setErrors(props.modelValue);
	if (props.focus) input.value.focus();
});
</script>

<style lang="scss" scoped>
.input {
	position: relative;
	display: inline-block;
	input {
		width: 100%;
		border-radius: 4px;
		padding: 8px;
		background-color: #FFFFFF;
		&::placeholder {
			color: #7E7F81;
		}
	}
}
</style>
