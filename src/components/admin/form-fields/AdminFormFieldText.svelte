<script lang="ts">
  import { DATA_FIELDS } from "$lib/admin/fields";
  import slugify from "slugify";
  import { onDestroy, onMount } from "svelte";

  let clazz = ''
	export { clazz as class }

  export let id: string
  export let name: string
  export let required: boolean = false
  export let placeholder: string = ''
  export let value: string = ''

  export let details: {
    slugify: boolean
  } | undefined = undefined

  let inputRef: HTMLInputElement | null

  const slugifyEvent = (e: Event) => {
    if (inputRef)
      inputRef.value = slugify(inputRef.value, {
        replacement: '_',
        lower: true,
        locale: 'vi',
        trim: false
      })
  }

  const icon = DATA_FIELDS.find(v => v.fieldName == 'Plain text')?.icon

  onMount(() => {
    if (details?.slugify) {
      inputRef?.addEventListener('input', slugifyEvent)
    }
  })

  onDestroy(() => {})
</script>

<label for={id} class={`block rounded px-3 py-2 bg-gray-200 focus-within:bg-gray-300 select-none ${clazz}`}>
  <p class="text-sm font-semibold mb-1 flex items-center space-x-2 text-gray-500">
    <span class="icon w-4 h-4">{@html icon}</span>
    {name}
  </p>

  <input bind:this={inputRef} type="text" name={name} id={id} bind:value={value}
    class="w-full border-none !bg-transparent p-0 !ring-0"
    required={required} placeholder={placeholder}
  />
  
  
</label>