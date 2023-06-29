<script lang="ts">
  import { DATA_FIELDS } from "$lib/admin/fields";
  import { Datepicker } from "flowbite-svelte";
  import slugify from "slugify";
  import { onDestroy, onMount } from "svelte";
  import flatpickr from "flatpickr";
  import { Vietnamese } from "flatpickr/dist/l10n/vn"
  import "flatpickr/dist/flatpickr.min.css"

  let clazz = ''
	export { clazz as class }

  export let id: string
  export let name: string
  export let required: boolean = false
  export let placeholder: string = ''
  export let value: string = ''

  const icon = DATA_FIELDS.find(v => v.fieldName == 'DateTime')?.icon

  let dateTime : HTMLElement

  onMount(() => {
    flatpickr(dateTime, {
      // locale: Vietnamese,
      enableTime: true,
      time_24hr: true,
      allowInput: true,
			clickOpens: true,
			onValueUpdate: (selectedDates, dateStr, instance) => {
				value = dateStr;
			}
    })
  })

</script>

<!-- <svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
</svelte:head> -->

<label for={id} class={`block rounded px-3 py-2 bg-gray-200 focus-within:bg-gray-300 select-none ${clazz}`}>
  <p class="text-sm font-semibold mb-1 flex items-center space-x-2 text-gray-500">
    <span class="icon w-4 h-4">{@html icon}</span>
    <span>{name}</span>
  </p>

  <input bind:this={dateTime} type="text" name={name} id={id} bind:value={value}
    class="w-full border-none !bg-transparent p-0 !ring-0"
    required={required} placeholder={placeholder}
  />
</label>

<style lang="postcss">
  :global(.flatpickr-months .flatpickr-month) {
    height: 50px;
  }
  
  :global(.flatpickr-current-month) {
    height: 40px;
    @apply flex justify-center items-stretch;
  }

  :global(.flatpickr-current-month .flatpickr-monthDropdown-months,
  .flatpickr-current-month .numInputWrapper) {
    @apply border border-solid border-gray-300 rounded px-2 text-sm font-semibold flex items-center;
  }

  :global(.flatpickr-current-month .flatpickr-monthDropdown-months) {
    /* @apply flex-grow min-w-0; */
  }

  :global(.flatpickr-current-month .numInputWrapper) {
    @apply flex-none w-16 ml-2;
  }

  :global(.flatpickr-current-month input.cur-year) {
    @apply !ring-0 bg-transparent;
  }
</style>