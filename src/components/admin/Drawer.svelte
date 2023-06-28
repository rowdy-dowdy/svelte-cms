<script lang="ts">
  import { clickOutside } from "$lib/utils/clickOutSide";
  import { fade, fly } from "svelte/transition";
  let clazz = ''
	export { clazz as class }
  export let show = false

  export let onClose = () => {
    show = false
  }
</script>

{#if show}
  <div transition:fade class="fixed top-0 left-0 z-50 w-full h-full bg-gray-900/70 !m-0"
    on:click|stopPropagation|self={onClose}
  ></div>
  <div 
    transition:fly={{
      x: 320,
      duration: 200
    }}
    class="overflow-y-auto z-50 p-0 bg-white dark:bg-gray-800 fixed inset-y-0 right-0 !m-0 {clazz}"
  >
    <slot/>
  </div>
{/if}