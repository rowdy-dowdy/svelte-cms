<script lang="ts">
  import { DATA_FIELDS, type FieldNameType } from '$lib/admin/fields';
  import { clickOutside } from '$lib/utils/clickOutSide';
  import type { DataRow, DataType } from '@prisma/client';
  import { Button, CloseButton, Dropdown, Spinner } from 'flowbite-svelte'
  import { sineIn } from 'svelte/easing';
  import AdminAddFieldText from '../add-form-filed/AdminAddFieldText.svelte';
  import AdminAddFieldRichText from '../add-form-filed/AdminAddFieldRichText.svelte';
  import AdminAddFieldNumber from '../add-form-filed/AdminAddFieldNumber.svelte';
  import AdminAddFieldBool from '../add-form-filed/AdminAddFieldBool.svelte';
  import AdminAddFieldEmail from '../add-form-filed/AdminAddFieldEmail.svelte';
  import AdminAddFieldUrl from '../add-form-filed/AdminAddFieldUrl.svelte';
  import AdminAddFieldDateTime from '../add-form-filed/AdminAddFieldDateTime.svelte';
  import AdminAddFieldSelect from '../add-form-filed/AdminAddFieldSelect.svelte';
  import AdminAddFieldFile from '../add-form-filed/AdminAddFieldFile.svelte';
  import AdminAddFieldRelation from '../add-form-filed/AdminAddFieldRelation.svelte';
  import AdminAddFieldJson from '../add-form-filed/AdminAddFieldJson.svelte';
  import { applyAction, deserialize } from '$app/forms';
  import { v4 } from 'uuid';
  import AdminFormFieldText from '../form-fields/AdminFormFieldText.svelte';
  import { alertStore } from '$stores/alertStore';
  import { invalidateAll } from '$app/navigation';
  import { collectionStore } from '$stores/collectionStore';
  import Drawer from '../Drawer.svelte';
  import Modal from '../Modal.svelte';
  import Sortable from 'sortablejs';
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';

  export let dataTypes: DataType[]
  let dataTypesRelation: DataType[] = dataTypes
  let nameCollection = ''
  let data: {id: string, field: FieldNameType, name: string, details?: any}[] = []

  const addField = (fieldName: FieldNameType) => {
    data = [...data, {
      id: v4(),
      name: "field",
      field: fieldName,
      details: undefined
    }]
  }

  const deleteField = (id: string) => {
    data = data.filter(v => v.id != id)
  }

  $: changeField($collectionStore.editValue)

  const changeField = (editValue?: DataType & {
    dataRows: DataRow[]
  }) => {
    if (!editValue) {
      nameCollection = ''
      data = []
      dataTypesRelation = dataTypes
      return
    }

    nameCollection = editValue.name

    let tempValue: any[] = editValue.dataRows.slice().map(v => ({
      id: v.id,
      name: v.name,
      field: v.field,
      details: v.details ? JSON.parse(v.details) : v.details
    }))

    data = tempValue
    dataTypesRelation = dataTypes.filter(v => v.id != editValue.id)
  }

  // sort list scene
  let listRecord: HTMLElement

  function arrayMove(orig: any, fromIndex: number, toIndex: number) {
    let arr = JSON.parse(JSON.stringify(orig));
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  }

  const sort = (e: any) => {
    let newStages = arrayMove(
      [...stages], 
      e.oldIndex, 
      e.newIndex
    )
    stages = newStages
  }

  $: stages = data

  let sortable: any
  $: createSortable($collectionStore.show)

  const createSortable = async (show: boolean) => {
    if (!browser) return
    if (!show) {
      sortable?.destroy()
      return
    }

    await tick()
    sortable = Sortable.create(listRecord, {
      group: 'listRecord',
      animation: 100,
      handle: ".item"
    })
  }

  // create or update table
  let loading = false
  const handelSubmit = async (e: SubmitEvent) => {
    if (loading) return
    loading = true

    const { name } = Object.fromEntries(new FormData(e.target as HTMLFormElement))

    const response = await fetch((e.target as HTMLFormElement).action, {
      method: 'POST',
      body: JSON.stringify({
        name,
        id: $collectionStore.editValue?.id,
        fields: stages
      })
    });

    const result: any = deserialize(await response.text())
    loading = false

    if (result.type == "success") {
      alertStore.addAlert({
        type: "success"
      })
      await invalidateAll()
      $collectionStore.show = false
    }
    else {
      alertStore.addAlert({
        type: 'error',
        description: result?.data?.error
      })
    }

  }

  let openDeleteModal = false
  const handelSubmitDelete = async () => {
    if (loading) return
    openDeleteModal = false
    loading = true

    const response = await fetch('/admin?/deleteTable', {
      method: 'POST',
      body: JSON.stringify({
        id: $collectionStore.editValue?.id,
        name: $collectionStore.editValue?.name,
      })
    });

    const result: any = deserialize(await response.text())
    loading = false

    if (result.type == "success") {
      alertStore.addAlert({
        type: "success"
      })
      await invalidateAll()
      $collectionStore.show = false
    }
    else {
      alertStore.addAlert({
        type: 'error',
        description: result?.data?.error
      })
    }
  }
</script>

<Drawer bind:show={$collectionStore.show} class="w-full max-w-[700px]">
  <form class='w-full max-w-[100vw] flex flex-col h-full' action="/admin?/createUpdateTable" on:submit|preventDefault={handelSubmit}>
    <div class="flex-none bg-gray-100 py-6 px-8">
      <h3 class='text-xl'>{$collectionStore.editValue ? `Edit ${$collectionStore.editValue.name} collection` : 'New Collection'}</h3>
      <AdminFormFieldText bind:value={nameCollection} id="nameCollection" name='name' required placeholder='eg. "posts' class='mt-6' details={{ slugify: true }} />
    </div>

    <div class="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-col space-y-4 relative">
      <span class='text-sm'>System fields: 
        <span class="px-1 text-xs bg-primary-200 rounded">id</span>,
        <span class="px-1 text-xs bg-primary-200 rounded">createdAt</span>,
        <span class="px-1 text-xs bg-primary-200 rounded">updatedAt</span>.
      </span>

      <div bind:this={listRecord} id="listRecord" class="flex flex-col space-y-4" on:sort={sort}>
        {#each data as item (item.id)}
          {#if item.field == "Plain text"}
            <AdminAddFieldText bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "Rich text"}
            <AdminAddFieldRichText bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "Number"}
            <AdminAddFieldNumber bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "Bool"}
            <AdminAddFieldBool bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "Email"}
            <AdminAddFieldEmail bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "Url"}
            <AdminAddFieldUrl bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "DateTime"}
            <AdminAddFieldDateTime bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
            {:else if item.field == "Select"}
            <AdminAddFieldSelect bind:value={item.name} bind:details={item.details} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "File"}
            <AdminAddFieldFile bind:value={item.name} bind:details={item.details} on:onDelete={() => deleteField(item.id)} />
            {:else if item.field == "Relation"}
            <AdminAddFieldRelation bind:value={item.name} bind:details={item.details} bind:dataTypes={dataTypesRelation} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "JSON"}
            <AdminAddFieldJson bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {/if}
        {/each}
      </div>
      <Button outline> 
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
        </span>
        New Fields
      </Button>
      <Dropdown ulClass="w-[636px] max-w-[calc(100vw-64px)]">
        <div class="w-full grid grid-cols-4 px-2 text-sm">
          {#each DATA_FIELDS.filter(v => v.fieldName != "ID").slice() as item}
            <div class="px-2 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 cursor-pointer"
              on:click={() => addField(item.fieldName)}
            >
              <span class="icon">{@html item.icon}</span>
              <span>{item.fieldName}</span>
            </div>
          {/each}
        </div>
      </Dropdown>
    </div>

    <div class="flex-none py-6 px-8 flex items-center space-x-4 border-t">
      {#if $collectionStore.editValue}
        <button class="text-red-600 font-semibold text-sm hover:text-red-500" on:click|preventDefault={() => openDeleteModal = true}>Delete</button>
      {/if}

      <Button color="none" class="!ml-auto" on:click={() => $collectionStore.show = false}>Cancel</Button>
      <Button type='submit'>Create</Button>
    </div>
  </form>
</Drawer>

<Modal bind:show={openDeleteModal}>
  <div class="text-center">
    <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this collection?</h3>
    <Button color="red" class="mr-2" on:click={handelSubmitDelete}>Yes, I'm sure</Button>
    <Button color='alternative' on:click={() => openDeleteModal = false}>No, cancel</Button>
  </div>
</Modal>

{#if loading}
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/70 grid place-items-center z-50">
    <Spinner color="green" size="10" />
  </div>
{/if}