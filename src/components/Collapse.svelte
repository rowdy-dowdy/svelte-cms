<script lang="ts">
	import { clickOutside } from "$lib/utils/clickOutSide";

  export let show = false
  let clazz = '';
	export { clazz as class };

  let firstShow = show
  let el: HTMLElement | null = null

  let time: ReturnType<typeof setTimeout>
  const collapse = (show: boolean) => {
    if (!el) return
    // el.style.transition = 'height .3s ease'
    clearTimeout(time)

    if (show) {
      el.style.height = el.scrollHeight + 'px'

      time = setTimeout(() => {
        if (el)
          el.style.height = "auto"
      }, 300);
    }
    else {
      el.style.height = el.clientHeight + 'px'

      time = setTimeout(() => {
        if (el)
          el.style.height = "0px"
      }, 0);
    }
  }

  $: collapse(show)
</script>

<div 
  bind:this={el} 
  style="{!firstShow ? 'height: 0px;' : ''} overflow: hidden; transition: height .3s ease;"
  class="{clazz}"
  use:clickOutside on:clickOutside={() => show = false}
>
  <slot />
</div>