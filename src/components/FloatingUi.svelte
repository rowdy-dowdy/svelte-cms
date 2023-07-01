<script lang="ts">
  import { browser } from '$app/environment';
  import { clickOutside } from '$lib/utils/clickOutSide';
  import { autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
  import type { Placement, Strategy, Middleware, Platform } from '@floating-ui/dom';
  import { onDestroy, onMount, tick } from 'svelte';

  export let referenceEl: HTMLElement
  export let show = true
  export let fullWidth = false
  export let placement: Placement | undefined = 'bottom'
  let floatingEl: HTMLElement

  let position: {
    placement?: Placement
    strategy?: Strategy 
    middleware?: Middleware[]
    platform?: Platform
  } | undefined = {
    strategy: 'fixed',
    placement: placement,
    middleware: [flip(), shift()],
  }

  let cleanup: any = null

  onMount(async () => {
    // await tick()
    cleanup = autoUpdate(referenceEl, floatingEl, () => {
      computePosition(referenceEl!, floatingEl, position).then(({x, y}) => {
        Object.assign(floatingEl.style, {
          width: fullWidth ? `${referenceEl!.clientWidth}px` : 'auto',
          top: `${y}px`,
          left: `${x}px`
        });
      });
    })
  })

  onDestroy(async () => {
    cleanup()
    // load = true
  })

</script>

<!-- {#if !load} -->
  <div bind:this={floatingEl} id="tooltip" class="fixed" 
    use:clickOutside on:clickOutside={() => show = false}
  >
    <slot />
  </div>
<!-- {/if} -->