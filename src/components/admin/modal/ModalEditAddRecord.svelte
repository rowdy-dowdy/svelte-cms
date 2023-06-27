<script lang="ts">
  import { DATA_FIELDS } from '$lib/admin/fields';
  import type { FieldNameType } from '$lib/admin/fields';
  import { clickOutside } from '$lib/utils/clickOutSide';
  import type { DataRow, DataType } from '@prisma/client';
  import { Drawer, Button, CloseButton, Dropdown, Spinner } from 'flowbite-svelte'
  import { sineIn } from 'svelte/easing';
  import { applyAction, deserialize } from '$app/forms';
  import { v4 } from 'uuid';
  import AdminFormFieldText from '../form-fields/AdminFormFieldText.svelte';
  import { alertStore } from '$stores/alertStore';
  import { invalidateAll } from '$app/navigation';
  import AdminFormFieldRichText from '../form-fields/AdminFormFieldRichText.svelte';
  import AdminFormFieldBool from '../form-fields/AdminFormFieldBool.svelte';
  import AdminFormFieldEmail from '../form-fields/AdminFormFieldEmail.svelte';
  import AdminFormFieldUrl from '../form-fields/AdminFormFieldUrl.svelte';
  import AdminFormFieldDateTime from '../form-fields/AdminFormFieldDateTime.svelte';
  import AdminFormFieldSelect from '../form-fields/AdminFormFieldSelect.svelte';
  import AdminFormFieldFile from '../form-fields/AdminFormFieldFile.svelte';
  import AdminFormFieldRelation from '../form-fields/AdminFormFieldRelation.svelte';
  import AdminFormFieldJson from '../form-fields/AdminFormFieldJson.svelte';
  import AdminFormFieldNumber from '../form-fields/AdminFormFieldNumber.svelte';

  type DataFieldType = (Omit<DataRow, 'field'> & {
    value: any
    field: FieldNameType
  })

  export let hidden = true
  export let dataType: DataType & {
    dataRows: DataRow[]
  }
  export let editValue: any | undefined

  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  const setDataValue = (editValue?: any) => {
    if (editValue) {
      data = data.map(v => {
        let tempValue = editValue[v.name]
  
        if (v.field == "Bool") {
          tempValue = true
        }
  
        return {
          ...v,
          value: tempValue
        }
      })
    }
    else {
      data = dataType.dataRows.map(v => {
        let tempValue: any = ''
        if ((v.field as FieldNameType) == "Bool") {
          tempValue = true
        }

        return {
          ...v,
          field: v.field as FieldNameType,
          value: tempValue
        }
      })
    }
  }

  let data: DataFieldType[] = []

  $: setDataValue(editValue)

  let loading = false
  const handelSubmit = async (e: SubmitEvent) => {
    if (loading) return
    loading = true

    const response = await fetch((e.target as HTMLFormElement).action, {
      method: 'POST',
      body: JSON.stringify({
        name: dataType.name,
        editId: editValue?.id,
        fields: data
      })
    });

    const result: any = deserialize(await response.text())
    loading = false

    if (result.type == "success") {
      alertStore.addAlert({
        type: "success"
      })
      await invalidateAll()
      hidden = true
    }
    else {
      alertStore.addAlert({
        type: 'error',
        description: result?.data?.error
      })
    }

  }
</script>

<Drawer placement='right' transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={hidden} id='editAddCollection'
  width="w-full max-w-[850px]"
  divClass="overflow-y-auto z-50 p-0 bg-white dark:bg-gray-800 fixed inset-y-0 right-0"
>
  <form class='w-full max-w-[100vw] flex flex-col h-full' action="/admin?/addEditRecord" on:submit|preventDefault={handelSubmit}>
    <div class="flex-none bg-gray-100 py-6 px-8">
      <h3 class='text-xl'>{editValue ? `Edit ${dataType.name} record` : 'New record'}</h3>
    </div>

    <div class="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-col space-y-4 relative">
      {#each data as item, i (item.id)}
        {#if item.field == "Plain text"}
          <AdminFormFieldText id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "Rich text"}
          <AdminFormFieldRichText id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "Number"}
          <AdminFormFieldNumber id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "Bool"}
          <AdminFormFieldBool id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "Email"}
          <AdminFormFieldEmail id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "Url"}
          <AdminFormFieldUrl id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "DateTime"}
          <AdminFormFieldDateTime id={item.id} name={item.name} bind:value={data[i].value} />
          {:else if item.field == "Select"}
          <AdminFormFieldSelect id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "File"}
          <AdminFormFieldFile id={item.id} name={item.name} bind:value={data[i].value} />
          {:else if item.field == "Relation"}
          <AdminFormFieldRelation id={item.id} name={item.name} bind:value={data[i].value} />
        {:else if item.field == "JSON"}
          <AdminFormFieldJson id={item.id} name={item.name} bind:value={data[i].value} />
        {/if}
      {/each}
    </div>

    <div class="flex-none py-6 px-8 flex items-center space-x-4 border-t">
      {#if editValue}
        <button class="text-red-600 font-semibold text-sm hover:text-red-500" on:click={() => hidden = true}>Delete</button>
      {/if}
      <Button color="none" on:click={() => hidden = true} class="!ml-auto">Cancel</Button>
      <Button type='submit'>{editValue ? 'Save' : 'Create'}</Button>
    </div>
  </form>
</Drawer>

{#if loading}
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/70 grid place-items-center">
    <Spinner color="green" size="10" />
  </div>
{/if}