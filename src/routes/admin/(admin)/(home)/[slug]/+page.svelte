<script lang="ts">
  import IconCog from "$components/icons/IconCog.svelte";
  import IconRefresh from "$components/icons/IconRefresh.svelte";
  import IconSearch from "$components/icons/IconSearch.svelte";
  import type { FieldNameType } from "$lib/admin/fields";
  import type { DataRow, DataType } from "@prisma/client";
  import { v4 } from "uuid";

  export let data

  type ComponentType = {
    data: any[],
    dataType: DataType & {
      dataRows: DataRow[]
    }
  }

  type ColumnType = {
    id: string,
    name: string,
    width: 'auto' | string,
    field: FieldNameType
  }

  const columns: ColumnType[] = [{
    id: v4(),
    name: 'id',
    width: '1px',
    field: 'ID'
  }, ...data.dataType.dataRows.map(v => ({id: v.id, name: v.name, field: v.field as FieldNameType, width: 'auto'})).concat({
    id: v4(),
    name: 'createdAt',
    width: '1px',
    field: 'DateTime'
  }, {
    id: v4(),
    name: 'updatedAt',
    width: '1px',
    field: 'DateTime'
  })]

</script>

<div class='w-full h-full p-6 overflow-y-auto flex flex-col'>
  <section class="flex-none flex items-center space-x-4">
    <div class="text-xl">
      <span class='text-gray-500'>Collections</span> <span class='px-3 select-none'>/</span>
      <span>{data.dataType.name}</span>
    </div>
    <span class="icon p-2 w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer">
      <IconCog />
    </span>
    <span class="icon p-2 w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer">
      <IconRefresh />
    </span>

    <div class='!ml-auto'></div>

    <button>
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m7.375 16.781 1.25-1.562L4.601 12l4.024-3.219-1.25-1.562-5 4a1 1 0 0 0 0 1.562l5 4zm9.25-9.562-1.25 1.562L19.399 12l-4.024 3.219 1.25 1.562 5-4a1 1 0 0 0 0-1.562l-5-4zm-1.649-4.003-4 18-1.953-.434 4-18z"></path></svg>
      </span>
      <span>API Preview</span>
    </button>

    <button>
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m7.375 16.781 1.25-1.562L4.601 12l4.024-3.219-1.25-1.562-5 4a1 1 0 0 0 0 1.562l5 4zm9.25-9.562-1.25 1.562L19.399 12l-4.024 3.219 1.25 1.562 5-4a1 1 0 0 0 0-1.562l-5-4zm-1.649-4.003-4 18-1.953-.434 4-18z"></path></svg>
      </span>
      <span>New Records</span>
    </button>
  </section>

  <section class='flex-none mt-8 flex items-center space-x-4'>
    <div class="w-full rounded-full bg-gray-200 px-4 py-3 flex items-center space-x-3">
      <span class="flex-none icon"><IconSearch /></span>
      <input type="text" class='flex-grow min-w-0' placeholder='Search ...' />
    </div>
  </section>

  <section class='flex-grow min-h-0 mt-8'>
    
  </section>

  <!-- <ModalAddRecord dataType={dataType} editValue={recordEdit} open={isOpenAddRecord} onClose={() => setIsOpenAddRecord(false)} /> -->
</div>