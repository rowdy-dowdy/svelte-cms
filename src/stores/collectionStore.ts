import type { DataRow, DataType } from '@prisma/client';
import { writable } from 'svelte/store';

type TypeStore = {
  hidden: boolean,
  editValue?: DataType & {
    dataRows: DataRow[]
  }
}

function createStore() {
	const { subscribe, set, update } = writable<TypeStore>({
    hidden: true,
    editValue: undefined
  });

	return {
		subscribe,
    set,
		openAddEditCollection: (data?: DataType & { dataRows: DataRow[] }) => update(n => ({
      editValue: data,
      hidden: false,
    }))
	};
}

export const collectionStore = createStore();