<template>
	<div class="suggest" ref="suggest">
		<label for="suggest-input" class="suggest__label" @click="clickLabel" v-if="$slots.default">
			<slot/>
		</label>
		<div class="suggest__head" id="suggest-input">
			<div class="suggest__tip" v-for="item in data.tips" :key="item">
				<span>{{item}}</span>
				<IconCross class="suggest__tip-cross" color="white" @click="remove(item)"/>
			</div>
			<a-input
				class="suggest__input"
				:minlength="3"
				v-model.trim="data.search"
				placeholder="Введите логин"
				type="text"
				:focus="true"
				:delay="props.delay"
				@update:modelValue="updateSearch"
				v-if="data.tips.length <= props.count"
			/>
		</div>
		<div class="suggest__results" ref="results" v-if="data.isOpen">
			<div class="suggest__results-note" v-if="data.loading">
				Загрузка
			</div>
			<template v-else-if="data.results?.length">
				<div class="suggest__results-item" ref="res" @click.stop="add(index)" v-for="(item, index) in data.results">
					<slot name="result" :item="item" v-if="$slots.result"/>
				</div>
			</template>
			<div class="suggest__results-note" v-else-if="!data.results?.length && !data.error">
				Нет данных
			</div>
			<div class="suggest__results-note" v-else-if="data.error">
				Ошибка {{data.error}}
			</div>
		</div>
	</div>
</template>

<script setup>
import IconCross from "@/svg/cross.svg";
import {searchItem} from "@/api/suggest";
import {computed, onMounted, onUnmounted, reactive, watch} from "vue";

const props = defineProps({
	minlength: {
		type: Number,
		default: 0
	},
	delay: {
		type: Number,
		default: 0
	},
	func: {
		type: Function,
		default: searchItem
	},
	size: {
		type: Number,
		default: 4
	},
	count: {
		type: Number,
		default: 10
	}
});

const data = reactive({
	isOpen: false,
	search: null,
	results: null,
	error: null,
	loading: false,
	tips: []
});

const suggest = ref(null);
const results = ref(null);
const res = ref(null);

const optionHeight = computed(() => (res.value?.[0]?.offsetHeight) ? res.value[0].offsetHeight : null);
const optionsMaxHeight = computed(() => optionHeight.value ? optionHeight.value * props.size + 'px' : 'auto');

const emits = defineEmits(['close', 'open', 'add', 'remove', 'search', 'results']);

const updateSearch = async (v) => {
	if (!v || v.length < props.minlength) {
		return closeSearch();
	}
	openSearch();
	emits('search', data.search);
	data.loading = true;
	const response = await props.func(data.search);
	data.loading = false;
	data.error = response.error;
	data.results = response.data;
	emits('results', data.results);
};

const openSearch = () => {
	data.isOpen = true;
	emits('open');
};

const closeSearch = () => {
	data.isOpen = false;
	data.results = null;
	emits('close');
};

const add = (index) => {
	const element = res.value[index];
	const alias = element.children[0].dataset.alias;
	data.tips.push(alias);
	emits('add');
	closeSearch();
};

const remove = (item) => {
	data.tips = data.tips.filter(i => i !== item);
	emits('remove');
};

const clickLabel = () => {
	suggest.value?.querySelector('input').focus();
};

const keydownHandler = (event) => {
	if (!results.value) return;
	const key = event.key;
	if (key === 'ArrowUp') {
		results.value.scroll({top: results.value.scrollTop - optionHeight.value, left: 0, behavior: "smooth"});
	} else if (key === 'ArrowDown') {
		results.value.scroll({top: results.value.scrollTop + optionHeight.value, left: 0, behavior: "smooth"});
	}
};

watch(res, next => {
	if (!next?.length) return;
	res.value?.forEach(i => {
		if (data.tips.includes(i.children[0].dataset.alias)) i.classList.add('hidden');
	});
}, {deep: true});

onMounted(() => {
	document.addEventListener('keydown', keydownHandler);
});

onUnmounted(() => {
	document.removeEventListener('keydown', keydownHandler);
});
</script>

<style lang="scss" scoped>
.suggest {
	position: relative;
	&__label {
		display: inline-block;
		margin-bottom: 12px;
		font-weight: 700;
		:deep {
			span {
				font-size: 20px;
				color: #ED131C;
			}
		}
	}
	&__head {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 4px;
		border-radius: 4px;
		padding: 4px;
		background-color: #FFFFFF;
		border: 1px solid #7E7F81;
	}
	&__tip {
		display: flex;
		align-items: center;
		border-radius: 4px;
		padding: 8px;
		color: #FFFFFF;
		background-color: SlateGrey;
		&-cross {
			width: 10px;
			height: auto;
			margin-left: 6px;
			cursor: pointer;
		}
	}
	&__input {
		min-width: 100px;
	}
	&__results {
		position: absolute;
		content: '';
		top: calc(100% + 4px);
		left: 0;
		width: 100%;
		border-radius: 4px;
		background-color: #FFFFFF;
		box-shadow: 1px 1px 1px rgba(0,0,0,0.2), -1px -1px 1px rgba(0,0,0,0.2);
		max-height: v-bind('optionsMaxHeight');
		overflow-y: auto;
		&-item {
			&.hidden {
				display: none;
			}
		}
		&-note {
			padding: 12px;
			text-align: center;
		}
	}
}
</style>
