<script lang="ts">
  import Collapse from "$components/Collapse.svelte";
  import IconCog from "$components/icons/IconCog.svelte";
  import { DATA_FIELDS } from "$lib/admin/fields";
  import { Button, Toggle } from "flowbite-svelte";
  import { createEventDispatcher, onMount } from "svelte";

  export let value: string
  let icon = DATA_FIELDS.find(v => v.fieldName == 'Email')?.icon

  let inputRef: HTMLInputElement | null

  let expanded = false

  const dispatch = createEventDispatcher()

	function onDelete() {
		dispatch('onDelete');
	}

  onMount(() => {
    if (inputRef) {
      inputRef.select()
      inputRef.focus()
    }
  })
</script>

<div class='rounded bg-gray-200 w-full group'>
  <div class="flex items-center w-full relative text-sm">
    <div class="flex-grow min-w-0 m-1.5 p-1 flex items-center space-x-2 focus-within:bg-gray-300 rounded">
      <span class="flex-none icon w-4 h-4">
        {@html icon}
      </span>
      <input bind:this={inputRef} type="text" class="flex-grow min-w-0 bg-transparent border-none !ring-0 py-1" required bind:value={value}/>
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