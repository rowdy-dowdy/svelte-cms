<script lang="ts">
  import { DATA_FIELDS } from "$lib/admin/fields";

  let clazz = ''
	export { clazz as class }

  export let id: string
  export let name: string
  export let required: boolean = false
  export let placeholder: string = ''
  export let value: string = ''

  const changeValue = (e: Event) => {
    value = (e.target as HTMLInputElement).value.replace(/\s/g, "")
  }

  const icon = DATA_FIELDS.find(v => v.fieldName == 'Url')?.icon
</script>

<label for={id} class={`block rounded px-3 py-2 bg-gray-200 focus-within:bg-gray-300 select-none ${clazz}`}>
  <p class="text-sm font-semibold mb-1 flex items-center space-x-2 text-gray-500">
    <span class="icon w-4 h-4">{@html icon}</span>
    {name}
  </p>

  <input type="email" name={name} id={id} bind:value={value}
    class="w-full border-none !bg-transparent p-0 !ring-0"
    required={required} placeholder={placeholder} on:input={changeValue}
  />
</label>