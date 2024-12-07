<template>
	<edit-container v-if="userStore.user">
		<structured-title
			:primary-title="t('social.social_icons')"
			:primary-description="
				t('social.social_icons_will_appear_below_your_header_text')
			"
			:secondary-items="socialSecondaryItems"
		>
			<template v-slot:primary>
				<div class="row items-start full-width">
					<grid-picker-group
						:columns="userStore.isMobile ? 7 : 8"
						row-gap="12px"
						:column-gap="userStore.isMobile ? '8px' : '12px'"
					>
						<template v-for="(item, key, index) in SocialMap" :key="index">
							<social-button
								:platform="item.platform"
								:display="index < (userStore.isMobile ? 6 : 15) || expandRef"
							>
								<bt-tooltip :label="item.platform" />
							</social-button>
						</template>
						<social-expand-button v-model:expand="expandRef" />
					</grid-picker-group>
				</div>

				<div class="row items-start full-width q-mt-lg">
					<vue-draggable-next
						style="width: 100%"
						v-if="userStore.user !== null && userStore.user.social.data"
						:list="userStore.user?.social.data"
					>
						<transition-group name="list">
							<template
								v-for="(item, index) in userStore.user?.social.data"
								:key="index"
							>
								<social-edit-item
									:platform="item.platform"
									:url="item.url"
									v-model:user-name="item.username"
									:style="{
										marginTop: '12px'
									}"
								/>
							</template>
						</transition-group>
					</vue-draggable-next>
				</div>
			</template>

			<template v-slot:secondary-0>
				<grid-picker-group :grid="false" v-model="userStore.user.social.size">
					<picker-component text="S" :value="SIZE_TYPE.SMALL" />
					<picker-component
						class="q-ml-md"
						text="M"
						:value="SIZE_TYPE.MEDIUM"
					/>
					<picker-component
						class="q-ml-md"
						text="L"
						:value="SIZE_TYPE.LARGER"
					/>
				</grid-picker-group>
			</template>
		</structured-title>
	</edit-container>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next';
import SocialExpandButton from 'src/components/social/SocialExpandButton.vue';
import EditContainer from 'src/pages/edit/EditContainer.vue';
import GridPickerGroup from 'src/components/base/GridPickerGroup.vue';
import PickerComponent from 'src/components/base/PickerComponent.vue';
import StructuredTitle from 'src/components/base/StructuredTitle.vue';
import SocialButton from 'src/components/social/SocialButton.vue';
import SocialEditItem from 'src/components/social/SocialEditItem.vue';
import BtTooltip from 'src/components/base/BtTooltip.vue';
import { ref, computed } from 'vue';
import { SocialMap } from 'src/types/SocialProps';
import { useUserStore } from 'src/stores/user';
import { useI18n } from 'vue-i18n';
import { SIZE_TYPE } from 'src/types/User';

const { t } = useI18n();
const expandRef = ref(false);
const userStore = useUserStore();
const socialSecondaryItems = computed(() => {
	if (!userStore.user) {
		return [];
	}
	return [
		{
			title: t('base.size'),
			visible: true
		}
	];
});
</script>
<style lang="scss"></style>
