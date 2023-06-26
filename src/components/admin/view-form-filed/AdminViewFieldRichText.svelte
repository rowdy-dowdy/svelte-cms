<script lang="ts">
  import { onMount } from "svelte";

  export let value: string

  let tempElement: HTMLDivElement | null = null
  if (typeof window !== 'undefined') {
    tempElement = document.createElement('div')
  }

  let outerHtmlString = ''

  onMount(() => {
    if (tempElement) {
      tempElement.innerHTML = value
      outerHtmlString = tempElement.innerText
    }
  })

</script>

<div class="min-w-[250px]">
  <div class='line-clamp-3'>{outerHtmlString}</div>
</div>