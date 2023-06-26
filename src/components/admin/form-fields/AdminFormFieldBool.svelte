<svelte:options immutable={true} />

<script lang="ts">
  import { DATA_FIELDS } from "$lib/admin/fields";
  import { Toggle } from "flowbite-svelte";

  let clazz = ''
	export { clazz as class }

  export let id: string
  export let name: string
  export let required: boolean = false
  export let placeholder: string = ''
  export let value: boolean = true

  export let details: {
    slugify: boolean
  } | undefined = undefined

  const icon = DATA_FIELDS.find(v => v.fieldName == 'Bool')?.icon

</script>

<!-- <label for={id} class={`block rounded px-3 py-2 bg-gray-200 focus-within:bg-gray-300 select-none ${clazz}`}>
  <p class="text-sm font-semibold mb-1 flex items-center space-x-2 text-gray-500">
    <span class="icon w-4 h-4">{@html icon}</span>
    {name}
  </p> -->

  <div class="custom">
    <Toggle bind:checked={value}>{name}</Toggle>
  </div>
<!-- </label> -->

<style>
  .custom :global(label) {
    @apply cursor-pointer;
  }
</style>