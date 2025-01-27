<template>
	<div class="user" :data-alias="props.alias" v-if="props.alias">
		<div class="user__avatar">
			<img :src="props.avatar || '/images/user.svg'" alt="">
		</div>
		<div class="user__info">
			<div class="user__name">{{props.name || props.alias}}</div>
			<div class="user__alias">{{props.alias}}</div>
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
.user {
	display: flex;
	align-items: center;
	width: 100%;
	padding: 12px;
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
	&__alias, &__name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100vw - 110px);
	}
	&__alias {
		color: #7E7F81;
	}
}
</style>
