<script lang="ts">
  import { DATA_FIELDS, type FieldNameType } from '$lib/admin/fields';
  import { clickOutside } from '$lib/utils/clickOutSide';
  import type { DataRow, DataType } from '@prisma/client';
  import { Drawer, Button, CloseButton, Dropdown, Spinner } from 'flowbite-svelte'
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

  type DataFieldType = (Omit<DataRow, 'field'> & {
    value: any
    field: FieldNameType
  })[]

  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  let data: {id: string, field: FieldNameType, name: string, }[] = []

  const addField = (fieldName: FieldNameType) => {
    data = [...data, {
      id: v4(),
      name: "field",
      field: fieldName,
    }]
  }

  const deleteField = (id: string) => {
    data = data.filter(v => v.id != id)
  }

  let loading = false
  const handelSubmit = async (e: SubmitEvent) => {
    if (loading) return
    loading = true

    const { name } = Object.fromEntries(new FormData(e.target as HTMLFormElement))

    const response = await fetch((e.target as HTMLFormElement).action, {
      method: 'POST',
      body: JSON.stringify({
        name,
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
    }
    else {
      alertStore.addAlert({
        type: 'error',
        description: result?.data?.error
      })
    }

  }
</script>

<Drawer placement='right' transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={$collectionStore.hidden} id='editAddCollection'
  width="w-full max-w-[700px]"
  divClass="overflow-y-auto z-50 p-0 bg-white dark:bg-gray-800 fixed inset-y-0 right-0"
>
  <form class='w-full max-w-[100vw] flex flex-col h-full' action="/admin?/createTable" on:submit|preventDefault={handelSubmit}>
    <div class="flex-none bg-gray-100 py-6 px-8">
      <h3 class='text-xl'>New Collection</h3>
      <AdminFormFieldText id="name" name='name' required placeholder='eg. "posts' class='mt-6' details={{ slugify: true }} />
    </div>

    <div class="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-col space-y-4 relative">
      <span class='text-sm'>System fields: 
        <span class="px-1 text-xs bg-primary-200 rounded">id</span>,
        <span class="px-1 text-xs bg-primary-200 rounded">createdAt</span>,
        <span class="px-1 text-xs bg-primary-200 rounded">updatedAt</span>.
      </span>

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
          <AdminAddFieldSelect bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
        {:else if item.field == "File"}
          <AdminAddFieldFile bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
          {:else if item.field == "Relation"}
          <AdminAddFieldRelation bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
        {:else if item.field == "JSON"}
          <AdminAddFieldJson bind:value={item.name} on:onDelete={() => deleteField(item.id)} />
        {/if}
      {/each}
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
        <button class="text-red-600 font-semibold text-sm hover:text-red-500" on:click={() => $collectionStore.hidden = true}>Delete</button>
      {/if}

      <Button color="none" class="!ml-auto" on:click={() => $collectionStore.hidden = true}>Cancel</Button>
      <Button type='submit'>Create</Button>
    </div>
  </form>
</Drawer>

{#if loading}
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-black/70 grid place-items-center">
    <Spinner color="green" size="10" />
  </div>
{/if}