<script lang="ts">
  import { clickOutside } from '$lib/utils/clickOutSide';
  import { autoPlacement, autoUpdate, computePosition, flip, shift } from '@floating-ui/dom';
  import type { Placement, Strategy, Middleware, Platform } from '@floating-ui/dom';
  import { onMount, tick } from 'svelte';

  export let referenceEl: HTMLElement | null
  export let show = true
  export let fullWidth = false
  let floatingEl: HTMLElement

  let position: {
    placement?: Placement
    strategy?: Strategy 
    middleware?: Middleware[]
    platform?: Platform
  } | undefined = {
    strategy: 'fixed',
    placement: "top",
    middleware: [flip(), shift()],
  }

  $: update(show)

  const update = async (show: boolean) => {
    if (!show) return
    await tick()
    if (referenceEl && floatingEl ) {
      autoUpdate(referenceEl, floatingEl, () => {
        computePosition(referenceEl!, floatingEl, position).then(({x, y}) => {
          Object.assign(floatingEl.style, {
            width: fullWidth ? `${referenceEl!.clientWidth}px` : 'auto',
            top: `${y}px`,
            left: `${x}px`
          });
        });
      })
    }
  }

  onMount(async () => {
    await tick()
    if (referenceEl && floatingEl && show) {
      autoUpdate(referenceEl, floatingEl, () => {
        computePosition(referenceEl!, floatingEl, position).then(({x, y}) => {
          Object.assign(floatingEl.style, {
            width: fullWidth ? `${referenceEl!.clientWidth}px` : 'auto',
            top: `${y}px`,
            left: `${x}px`
          });
        });
      })
    }
  })

</script>

{#if show}
  <div bind:this={floatingEl} id="tooltip" class="fixed" 
    use:clickOutside on:clickOutside={() => show = false}
  >
    <slot />
  </div>
{/if}