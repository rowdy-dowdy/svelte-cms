<script lang="ts">
  import type { FieldNameType } from "$lib/admin/fields";
  import { Button, Checkbox, Dropdown, DropdownItem, Pagination, Select, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Toggle } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import { v4 } from "uuid";
  import { page } from "$app/stores";
  import type { LinkType, SelectOptionType } from "flowbite-svelte/dist/types.js";
  import ModalEditAddRecord from "$components/admin/modal/ModalEditAddRecord.svelte";
  import AdminViewFieldId from "$components/admin/view-form-filed/AdminViewFieldId.svelte";
  import AdminViewFieldText from "$components/admin/view-form-filed/AdminViewFieldText.svelte";
  import AdminViewFieldRichText from "$components/admin/view-form-filed/AdminViewFieldRichText.svelte";
  import AdminViewFieldBool from "$components/admin/view-form-filed/AdminViewFieldBool.svelte";
  import AdminViewFieldDateTime from "$components/admin/view-form-filed/AdminViewFieldDateTime.svelte";
  import { goto } from "$app/navigation";
  import { collectionStore } from "$stores/collectionStore.js";
  import type { DataRow } from "@prisma/client";

  export let data

  let search = ''

  let columns: {
    id: string,
    name: string,
    show: boolean,
    width: 'auto' | string,
    field: FieldNameType
  }[] = []

  $: changeColumns(data.dataType.dataRows)

  const changeColumns = (dataRows: DataRow[]) => {
    columns = [{
      id: v4(),
      name: 'id',
      width: 'auto',
      show: true,
      field: 'ID'
    }, ...dataRows.map(v => ({
      id: v.id, name: v.name, show: true, field: v.field as FieldNameType, width: 'auto'
    })).concat({
      id: v4(),
      name: 'createdAt',
      width: '1px',
      show: true,
      field: 'DateTime'
    }, {
      id: v4(),
      name: 'updatedAt',
      width: '1px',
      show: true,
      field: 'DateTime'
    })]
  }

  let pages: LinkType[] = []

  $: createPage(data.count, data.page, data.perPage)

  const createPage = (count: number, page: number, perPage: number) => {
    let lastPage = Math.ceil(count / perPage)
    let query = new URLSearchParams($page.url.searchParams.toString())

    let tempPage: LinkType[] = [],
        moreLeft = false,
        moreRight = false

    for ( let i = 1; i < lastPage; i++ ) {
      if ( (i < 2 || i > (lastPage - 2))
        || (i > (page - 3) && i < (page + 3)) ) {
        query.set('page', i.toString())
        tempPage.push({
          name: i.toString(),
          href: i == page ? '' : `?${query}`,
          active: i == page
        })
      }
      else if (i <= (page - 3) && !moreLeft) {
        tempPage.push({
          name: '...',
          href: '#',
          active: false
        })
        moreLeft = true
      }
      else if (i >= (page + 3) && !moreRight) {
        tempPage.push({
          name: '...',
          href: '#',
          active: false
        })
        moreRight = true
      }
    }

    pages = tempPage
  }

  const changePage = (type: "next" | "previous") => {
    let lastPage = Math.ceil(data.count / data.perPage)
    let query = new URLSearchParams($page.url.searchParams.toString())
    if (data.page > 1 && type == "previous") {
      query.set('page', `${data.page - 1}`)
      goto(`?${query}`)
    }
    else if (data.page < lastPage && type == "next") {
      query.set('page', `${data.page + 1}`)
      goto(`?${query}`)
    }
  }

  let rowsPerPage: SelectOptionType[] = [
    { name: 5, value: 5 },
    { name: 10, value: 10 },
    { name: 20, value: 20 },
    { name: 50, value: 50 },
    { name: 100, value: 100 }
  ]

  const changePerPage = (e: Event) => {
    let query = new URLSearchParams($page.url.searchParams.toString())

    query.set('perPage', (e.target as HTMLInputElement).value || "10")
        
    goto(`?${query.toString()}`)
  }

  let showModalEditAddRecord = false
  let recordEdit: any | undefined = undefined

  const openAddEditRecord = (e: Event, row?: any) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return

    recordEdit = row
    
    showModalEditAddRecord = true
  }

</script>

<div class='w-full h-full p-6 overflow-y-auto flex flex-col space-y-8'>
  <section class="flex items-center space-x-4">
    <div class="text-xl">
      <span class='text-gray-500'>Collections</span> <span class='px-3 select-none'>/</span>
      <span>{data.dataType.name}</span>
    </div>
    <span class="icon p-2 w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer"
      on:click={() => collectionStore.openAddEditCollection(data.dataType)}
    >
      <span class="material-symbols-outlined mate">settings</span>
    </span>
    <span class="icon p-2 w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer">
      <span class="material-symbols-outlined">cached</span>
    </span>

    <div class='!ml-auto'></div>

    <Button outline>
      <span class="material-symbols-outlined">code</span>
      <span>&nbsp;API Preview</span>
    </Button>

    <Button on:click={openAddEditRecord}>
      <span class="material-symbols-outlined">add</span>
      <span>&nbsp;New Records</span>
    </Button>
  </section>

  <section class='flex items-center space-x-4'>
    <form class="w-full h-12 rounded-full bg-gray-200 px-4 flex items-center space-x-3">
      <span class="material-symbols-outlined">search</span>
      <input type="text" class='flex-grow min-w-0 border-none !ring-0 bg-transparent p-0' placeholder='Search ...' bind:value={search} />
      {#if search != ""}
        <div transition:slide={{axis: 'x'}} class="flex-none flex">
          <Button size="xs" color="yellow" type="submit">Search</Button>
          <Button size="xs" color="none" on:click={() => search = ""}>Clear</Button>
        </div>
      {/if}
    </form>
  </section>

  <section class="w-full custom-table">
    <Table hoverable={true} striped={true} divClass="relative border border-gray-300 rounded-lg overflow-hidden">
      <TableHead>
        <TableHeadCell class="w-0 pr-0">
          <Checkbox />
        </TableHeadCell>
        {#each columns.slice().filter(v => v.show) as item}
          <TableHeadCell width={item.width}>{item.name}</TableHeadCell>
        {/each}
        <TableHeadCell class="w-0">
          <button class="p-1 rounded hover:bg-gray-200">
            <span class="material-symbols-outlined">more_horiz</span>
          </button>
          <Dropdown placement="bottom-end">
            {#each columns.slice().filter(v => v.name != "id") as item}
              <DropdownItem>
                <Toggle color="green" bind:checked={item.show}>{item.name}</Toggle>
              </DropdownItem>
            {/each}
          </Dropdown>
        </TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each data.data as item (item.id)}
          <TableBodyRow on:click={(e) => openAddEditRecord(e, item)} class="cursor-pointer">
            <TableBodyCell class="w-0 pr-0">
              <Checkbox />
            </TableBodyCell>
            {#each columns.slice().filter(v => v.show) as column (`${item.id}-${column.id}`)}
              <TableBodyCell tdClass="px-6 py-4 font-normal text-gray-900 dark:text-white">
                {#if column.field == "ID"}
                  <AdminViewFieldId value={item[column.name]} />
                {:else if column.field == "Plain text"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "Rich text"}
                  <AdminViewFieldRichText value={item[column.name]} />
                {:else if column.field == "Number"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "Bool"}
                  <AdminViewFieldBool value={item[column.name]} />
                {:else if column.field == "Email"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "Url"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "DateTime"}
                  <AdminViewFieldDateTime value={item[column.name]} />
                {:else if column.field == "Select"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "File"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "Relation"}
                  <AdminViewFieldText value={item[column.name]} />
                {:else if column.field == "JSON"}
                  <AdminViewFieldText value={item[column.name]} />
                {/if}
              </TableBodyCell>
            {/each}
            <TableBodyCell tdClass="px-6 py-4 font-normal text-gray-900 dark:text-white">
              <span class="material-symbols-outlined">arrow_right_alt</span>
            </TableBodyCell>
          </TableBodyRow>
        {:else}
          <TableBodyRow>
            <TableBodyCell colspan={columns.length + 2}>
              <div class="flex flex-col items-center space-y-4">
                <span>There are no records</span>
                <Button size="xs" on:click={openAddEditRecord}>
                  <span class="material-symbols-outlined">add</span>
                  <span>&nbsp;New Records</span>
                </Button>
              </div>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
        <TableBodyRow>
          <TableBodyCell colspan={columns.length + 2}>
            <section class="flex items-center justify-between space-x-4">
              <span class="text-gray-500">Showing 
                <span class="text-primary-900">
                  {(data.page - 1) * data.perPage + (data.data.length > 0 ? 1 : 0)} - 
                  {(data.page - 1) * data.perPage + data.data.length}</span> of 
                <span>{data.count}</span>
              </span>
              <span class="!ml-auto text-gray-500 flex items-center space-x-2">
                <span>Rows per page</span>
                <Select size="sm" items={rowsPerPage}  value={data.perPage} placeholder="" 
                  on:change={(e) => changePerPage(e)} />
              </span>
              <Pagination {pages} on:previous={() => changePage("previous")} on:next={() => changePage("next")} />
            </section>
          </TableBodyCell>
        </TableBodyRow>
      </TableBody>
    </Table>
  </section>
</div>

<ModalEditAddRecord bind:dataType={data.dataType} bind:editValue={recordEdit} bind:show={showModalEditAddRecord} />

<style>
  .custom-table :global(table) {
    /* table-layout: fixed; */
    /* border-collapse: separate; */
    min-width: 100%;
  }
</style>