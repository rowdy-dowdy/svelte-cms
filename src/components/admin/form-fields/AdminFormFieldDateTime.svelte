<script lang="ts">
  import { DATA_FIELDS } from "$lib/admin/fields";
  import { Datepicker } from "flowbite-svelte";
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

  const icon = DATA_FIELDS.find(v => v.fieldName == 'DateTime')?.icon

</script>

<label for={id} class={`block rounded px-3 py-2 bg-gray-200 focus-within:bg-gray-300 select-none ${clazz}`}>
  <p class="text-sm font-semibold mb-1 flex items-center space-x-2 text-gray-500">
    <span class="icon w-4 h-4">{@html icon}</span>
    <span>{name}</span>
  </p>

  <!-- <Datepicker datepickerFormat="dd/mm/yyyy" /> -->
</label>