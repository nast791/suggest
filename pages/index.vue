<template>
	<div class="index page">
		<Suggest :minlength="minlength" :delay="delay" :func="searchItem" :size="size" :count="count">
			<span>*</span> Пользователь или компания (до {{count}})
			<template #result="{item}">
				<component
					:is="[User, Company].find(i => i.__name.toLowerCase() === item.type)"
					:key="item.alias"
					:alias="`@${item.alias}`"
					:avatar="item.avatar"
					:name="item.name"
					v-if="[User, Company].find(i => i.__name.toLowerCase() === item.type)"
				/>
			</template>
		</Suggest>
	</div>
</template>

<script setup>
import User from "@/components/molecules/User.vue";
import Company from "@/components/molecules/Company.vue";
import Suggest from "@/components/molecules/Suggest.vue";
import {searchItem} from "@/api/suggest";

const delay = 1000;
const minlength = 3;
const size = 4;
const count = 10;
</script>

<style lang="scss" scoped>

</style>
