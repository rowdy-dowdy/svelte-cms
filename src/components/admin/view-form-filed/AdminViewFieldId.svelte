<script lang="ts">
  export let value: string

  let copied = false

  const copy = () => {
    navigator.clipboard.writeText(value)
    copied = true

    setTimeout(() => {
      copied = false
    }, 500);
  }
</script>

<span class="px-2 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 inline-flex items-center space-x-1 
  whitespace-nowrap cursor-pointer transition-all {copied ? '!bg-green-300' : ''}" 
  on:click={copy}
>
  <span class="material-symbols-outlined text-sm">content_copy</span>
  <span>{value}</span>
</span>