<template>
	<page-title-component :show-back="true" :title="t('templates')" />
	<bt-scroll-area class="nav-height-scroll-area-conf">
		<div class="q-pa-md column q-list-class">
			<!-- <div class="row q-pa-md justify-between">
      <q-select
        v-model="category"
        :options="applicationStore.templates"
        label="Category"
        class="col-3"
      />
      <q-btn
        label="Topic Repo"
        class="col-2"
        flat
        color="primary"
        @click="
          () => {
            this.$router.push('/topicsRepo');
          }
        "
      />
    </div> -->
			<q-table
				flat
				:rows="applicationStore.templates"
				:columns="columns"
				row-key="id"
				:pagination="initialPagination"
			>
				<!-- <template v-slot:top-right>
        <q-btn label="Save" class="col-1" flat color="primary" @click="onSave()" />
      </template> -->
				<template v-slot:body-cell-variables="props">
					<q-td :props="props">
						{{ props.row.variables.join() }}
					</q-td>
				</template>

				<template v-slot:body-cell-action="props">
					<q-td :props="props">
						<q-btn
							:label="t('view')"
							class="col-1"
							flat
							color="primary"
							@click="
								() => {
									this.$router.push(
										'/template/' + props.row.id
									);
								}
							"
						/>
					</q-td>
				</template>
			</q-table>
		</div>
	</bt-scroll-area>
</template>

<script>
import { useNotificationStore } from '../../../stores/notification';
import { ref } from 'vue';
import PageTitleComponent from 'components/PageTitleComponent.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { notifyFailed } from '../../../utils/btNotify';
import { i18n } from '../../../boot/i18n';

const columns = [
	{
		name: 'name',
		align: 'left',
		label: i18n.global.t('name'),
		field: 'name',
		sortable: false
	},
	{
		name: 'notifyGroup',
		align: 'left',
		label: i18n.global.t('notify_group'),
		field: 'notifyGroup',
		sortable: false
	},
	{
		name: 'status',
		align: 'left',
		label: i18n.global.t('status'),
		field: 'status',
		sortable: false
	},
	{
		name: 'action',
		align: 'right',
		label: i18n.global.t('action'),
		sortable: false
	}
];

export default {
	components: {
		PageTitleComponent
	},
	setup() {
		const $q = useQuasar();
		const { t } = useI18n();

		const applicationStore = useNotificationStore();

		const category = ref('All');
		const list = ref([]);
		let isNew = false;

		function updateList() {
			let result = applicationStore.topicList.find(
				(t) => t.category == category.value
			);
			if (!result) {
				isNew = true;
				list.value = [];
				return;
			}
			isNew = false;

			let l = JSON.parse(result.content);
			let r = [];
			for (const t of l) {
				let tt = applicationStore.topics.find((to) => to.id == t);
				r.push(tt);
			}

			list.value = r;
		}

		async function onSave() {
			$q.loading.show();
			try {
				let obj = {
					category: category.value,
					content: JSON.stringify(list.value.map((t) => t.id))
				};
				if (isNew) {
					await applicationStore.createTopicList(obj);
				} else {
					await applicationStore.updateTopicList(obj);
				}

				updateList();
			} catch (e) {
				notifyFailed(
					e.message || t('errors.something_wrong_please_try_again')
				);
			} finally {
				$q.loading.hide();
			}
		}

		async function onDelete(row) {
			let index = list.value.findIndex((t) => t.id == row.id);

			if (index < 0 || index > list.value.length - 1) {
				return;
			}
			list.value.splice(index, 1);
		}

		return {
			initialPagination: {
				sortBy: 'desc',
				descending: false,
				page: 1,
				rowsPerPage: 1000
			},
			columns,
			category,
			list,
			applicationStore,
			// addTopic,
			onSave,
			onDelete,
			t
		};
	}
};
</script>
