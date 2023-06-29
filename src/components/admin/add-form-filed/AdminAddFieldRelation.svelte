<script lang="ts">
  import Collapse from "$components/Collapse.svelte";
  import IconCog from "$components/icons/IconCog.svelte";
  import { DATA_FIELDS } from "$lib/admin/fields";
  import type { DataType } from "@prisma/client";
  import { Button, Dropdown, DropdownItem, Toggle } from "flowbite-svelte";
  import slugify from "slugify";
  import { createEventDispatcher, onMount } from "svelte";
  import { v4 } from "uuid";

  export let value: string
  export let details: any = {
    collectionId: null,
    type: 'single'
  }

  export let dataTypes: DataType[]
  let icon = DATA_FIELDS.find(v => v.fieldName == 'Relation')?.icon

  let inputRef: HTMLInputElement | null
  let selectRef: HTMLSelectElement
  let expanded = false

  const dispatch = createEventDispatcher()

	function onDelete() {
		dispatch('onDelete');
	}

  const handelInput = (e: Event) => {
    const { value: inputValue } = e.target as HTMLInputElement

    value = slugify(inputValue, {
      replacement: '_',
      lower: true,
      locale: 'vi',
      trim: false
    })
  }

  onMount(() => {
    if (inputRef) {
      inputRef.select()
      inputRef.focus()
    }
  })
</script>

<div class="flex items-stretch -ml-8 group">
  <div class="item grid place-items-center px-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
    <span class="material-symbols-outlined text-lg text-gray-500">drag_indicator</span>
  </div>
  <div class='flex-grow min-w-0 rounded bg-gray-200 w-full group'>
    <div class="flex items-center w-full relative text-sm cursor-move">
      <div class="flex-grow min-w-0 m-1.5 p-1 flex items-center focus-within:bg-gray-300 rounded">
        <span class="flex-none icon w-4 h-4">
          {@html icon}
        </span>
        <input bind:this={inputRef} type="text" class="flex-grow min-w-0 bg-transparent border-none !ring-0 py-1"
          required bind:value={value} on:input={handelInput}/>
      </div>

      <div class="flex-none self-stretch  border-l border-gray-300 p-1.5">
        <label class="w-full h-full px-2 flex items-center focus-within:bg-gray-300 rounded text-sm">
          {#if details.collectionId == null}
            <input type="text" class="sr-only" required>
            <span class="text-gray-600">Select Collection *</span>
          {:else}
            {dataTypes.find(v => v.id == details.collectionId)?.name || ""}
          {/if}
        </label>
        <Dropdown>
          {#each dataTypes as dataType}
            <DropdownItem on:click={() => details.collectionId = dataType.id}>{dataType.name}</DropdownItem>
          {:else}
            <DropdownItem class="bg-gray-100 text-gray-500">Empty</DropdownItem>
          {/each}
        </Dropdown>
      </div>

      <div class="flex-none self-stretch  border-l border-gray-300 p-1.5">
        <select bind:value={details.type} class="w-full h-full px-2 flex items-center focus-within:bg-gray-300 rounded bg-transparent focus:ring-0 border-none text-sm">
          <option value="multiple">Multiple</option>
          <option value="single" selected>Single</option>
        </select>
      </div>

      <div class="flex-none p-2 border-l">
        <span class="icon w-8 h-8 p-1 cursor-pointer hover:bg-gray-300 rounded-full"
          on:click|stopPropagation={() => expanded = !expanded}
        ><IconCog /></span>
      </div>
    </div>
    <Collapse bind:show={expanded}>
      <div class='rounded-b border-2 border-gray-300 p-2 bg-white'>
        <div class="flex justify-between items-center">
          <div class="select-none cursor-pointer">
            <Toggle size='small' >None Empty</Toggle>
          </div>
          <span on:click={onDelete} class="text-sm text-red-600 cursor-pointer hover:underline">Remove</span>
        </div>
      </div>
    </Collapse>
  </div>
</div>