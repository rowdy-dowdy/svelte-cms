<script lang="ts">
  import { clickOutside } from "$lib/utils/clickOutSide";
  import { fade, fly, scale } from "svelte/transition";
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
    transition:scale={{
      start: 0.3,
      duration: 200
    }}
    class="fixed top-0 left-0 right-0 h-modal md:inset-0 md:h-full z-50 w-full p-4 flex justify-center items-center pointer-events-none"
  >
    <div class="flex relative max-w-md w-full max-h-full pointer-events-auto {clazz}">
      <div class="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border-gray-200 dark:border-gray-700 shadow-md relative flex flex-col mx-auto w-full">
        <button class="focus:outline-none whitespace-normal m-0.5 rounded-lg focus:ring-2 p-1.5 focus:ring-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 ml-auto absolute top-3 right-2.5"
          on:click={onClose}>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button>
        <div class="p-6 space-y-6 flex-1 overflow-y-auto overscroll-contain">
          <slot/>
        </div>
      </div>
    </div>
  </div>
{/if}