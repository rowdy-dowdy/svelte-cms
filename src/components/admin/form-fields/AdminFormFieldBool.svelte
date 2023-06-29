<svelte:options immutable={true} />

<script lang="ts">
  import { DATA_FIELDS } from "$lib/admin/fields";
  import { Toggle } from "flowbite-svelte";

  // let clazz = ''
	// export { clazz as class }

  // export let id: string
  export let name: string
  // export let required: boolean = false
  // export let placeholder: string = ''
  export let value: boolean = true

  // export let details: {
  //   slugify: boolean
  // } | undefined = undefined

  const icon = DATA_FIELDS.find(v => v.fieldName == 'Bool')?.icon

</script>

<div class="custom">
  <Toggle bind:checked={value}>{name}</Toggle>
</div>

<style>
  .custom :global(label) {
    @apply cursor-pointer;
  }
</style>