<template>
	<div class="company" :data-alias="props.alias" v-if="props.alias">
		<div class="company__avatar">
			<img :src="props.avatar || '/images/company.svg'" alt="">
		</div>
		<div class="company__info">
			<div class="company__name">{{props.name || props.alias}}</div>
			<div class="company__note">Компания</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	avatar: {
		type: [String, null],
		default: null
	},
	name: {
		type: [String, null],
		default: null
	},
	alias: {
		type: String,
		default: ''
	},
});
</script>

<style lang="scss" scoped>
.company {
	display: flex;
	align-items: center;
	padding: 12px;
	width: 100%;
	cursor: pointer;
	&:hover {
		background-color: #D3D3D3;
	}
	&__avatar {
		width: 40px;
		min-width: 40px;
		height: 40px;
		border-radius: 4px;
		margin-right: 12px;
		overflow: hidden;
		img {
			display: inline-block;
			width: 100%;
			height: auto;
		}
	}
	&__note, &__name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100vw - 110px);
	}
	&__note {
		color: #7E7F81;
	}
}
</style>
