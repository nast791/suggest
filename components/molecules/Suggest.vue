<template>
	<div class="suggest">
		<label>
			<span class="suggest__label" v-if="$slots.default">
				<slot/>
			</span>
			<div class="suggest__head">
				<div class="suggest__tips" v-if="data.tips.length > 0">
					<div class="suggest__tip" v-for="item in data.tips" :key="item">
						<span>{{item}}</span>
						<IconCross class="suggest__tip-cross" color="white" @click="remove(item)"/>
					</div>
				</div>
				<a-input
					:minlength="3"
					v-model.trim="data.search"
					placeholder="Введите логин"
					type="text"
					:focus="true"
					:delay="props.delay"
					@update:modelValue="updateSearch"
					v-else
				/>
			</div>
		</label>
		<div class="suggest__results" v-if="data.results">
			<div class="suggest__results-item" ref="res" @click.stop="add(index)" v-for="(item, index) in data.results">
				<slot name="result" :item="item" v-if="$slots.result"/>
			</div>
		</div>
	</div>
</template>

<script setup>
// TODO: Предусмотреть возможность управления саджестом с клавиатуры (стрелками клавиатуры)
// TODO: Проработать все состояния: загрузка, отсутствие данных, серверная ошибка (400/500). Пример запроса с ошибкой 400: https://habr.com/kek/v2/publication/suggest-mention?q=}}}. Ошибку с кодом 500 предлагается эмулировать самостоятельно.
// TODO: Проработать accessibility, например использовать правильные ARIA-атрибуты для элементов саджеста
// TODO: Предусмотреть мобильный и десктопный вид
// TODO: Предусмотреть возможность выбора нескольких сущностей из саджеста (конфигурируемое максимальное количество выбранных сущностей)
import IconCross from "@/svg/cross.svg";
import {searchItem} from "@/api/suggest";
import {computed, reactive} from "vue";

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
	}
});

const data = reactive({
	search: null,
	results: null,
	tips: []
});

const res = ref(null);

const optionHeight = computed(() => (res.value?.[0]?.offsetHeight) ? res.value[0].offsetHeight : null);
const optionsMaxHeight = computed(() => optionHeight.value ? optionHeight.value * props.size + 'px' : 'auto');

const emits = defineEmits(['close', 'add', 'remove', 'search', 'results']);

const updateSearch = async (v) => {
	if (!v) return clearSearch();
	if (v.length < props.minlength) return data.results = null;
	emits('search', data.search);
	const response = await props.func(v);
	data.results = response.data;
	emits('results', data.results);
	console.log(data.results)
};

const closeSearch = () => {
	clearSearch();
	emits('close');
};

const clearSearch = () => {
	data.search = null;
	data.results = null;
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
		border-radius: 4px;
		padding: 4px;
		background-color: #FFFFFF;
		border: 1px solid #7E7F81;
	}
	&__tips {
		display: flex;
		align-items: center;
		gap: 4px;
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
	&__results {
		position: absolute;
		content: '';
		top: calc(100% + 4px);
		left: 0;
		width: 100%;
		border-radius: 4px;
		background-color: #FFFFFF;
		border: 1px solid rgba(0,0,0,0.2);
		max-height: v-bind('optionsMaxHeight');
		overflow-y: auto;
	}
}
</style>
