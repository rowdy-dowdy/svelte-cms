<script lang="ts">
  import Collapse from "$components/Collapse.svelte";
  import IconCog from "$components/icons/IconCog.svelte";
  import { DATA_FIELDS } from "$lib/admin/fields";
  import { Button, Toggle } from "flowbite-svelte";
  import slugify from "slugify";
  import { createEventDispatcher, onMount } from "svelte";

  export let value: string
  export let details: any = {
    props: '',
    type: 'single'
  }
  let icon = DATA_FIELDS.find(v => v.fieldName == 'Select')?.icon

  let inputRef: HTMLInputElement | null

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
        <input bind:value={details.props} type="text" class="w-full h-full px-2 flex items-center focus-within:bg-gray-300 rounded bg-transparent focus:ring-0 border-none text-sm" placeholder="Choices: eg. optionA, optionB" />
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