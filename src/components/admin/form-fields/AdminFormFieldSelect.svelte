<script lang="ts">
  import FloatingUi from "$components/FloatingUi.svelte";
  import { DATA_FIELDS } from "$lib/admin/fields";
  import slugify from "slugify";
  import { onDestroy, onMount } from "svelte";

  let clazz = ''
	export { clazz as class }

  export let id: string
  export let name: string
  export let required: boolean = false
  export let placeholder: string = ''
  export let defaultValue: any = ''
  export let value: string = ''
  
  export let details: {
    slugify: boolean
  } | undefined = undefined

  const icon = DATA_FIELDS.find(v => v.fieldName == 'Select')?.icon

  let referenceEl: HTMLElement
  let show = false

</script>

<label for={id} class={`block rounded bg-gray-200 focus-within:bg-gray-300 select-none ${clazz}`}>
  <p class="text-sm font-semibold mb-1 px-3 pt-2 flex items-center space-x-2 text-gray-500">
    <span class="icon w-4 h-4">{@html icon}</span>
    {name}
  </p>

  <div bind:this={referenceEl} class="px-3 pb-2 cursor-pointer" 
    on:click|stopPropagation={() => show = !show}
  >
    --Select--
  </div>
  <FloatingUi bind:referenceEl={referenceEl} bind:show={show} fullWidth={true}>
    <div class="w-full p-2 border shadow bg-white h-96">
      fsdf
    </div>
  </FloatingUi>
</label>