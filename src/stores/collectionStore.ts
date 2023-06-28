import type { DataRow, DataType } from '@prisma/client';
import { writable } from 'svelte/store';

type TypeStore = {
  show: boolean,
  editValue?: DataType & {
    dataRows: DataRow[]
  }
}

function createStore() {
	const { subscribe, set, update } = writable<TypeStore>({
    show: false,
    editValue: undefined
  });

	return {
		subscribe,
    set,
		openAddEditCollection: (data?: DataType & { dataRows: DataRow[] }) => update(n => ({
      editValue: data,
      show: true,
    }))
	};
}

export const collectionStore = createStore();