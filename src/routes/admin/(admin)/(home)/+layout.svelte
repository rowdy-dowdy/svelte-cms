<script lang="ts">
  import ModalEditAddCollection from '$components/admin/modal/ModalEditAddCollection.svelte';
  import { collectionStore } from '$stores/collectionStore.js';
  import { Button } from 'flowbite-svelte';

  export let data

  $: dataFilter = data.dataTypes
</script>

<div class="w-full h-full flex">
  <div class="flex-none">
    <div class='w-60 h-full bg-white border-r'>
      <div class="px-4 py-6 border-b">
        <input type="text" class='px-2 py-1 hover:!bg-gray-300 focus:!bg-gray-200 rounded' placeholder='Search collection'/>
      </div>
      <div class="flex flex-col space-y-1 px-4 py-4">
        <!-- <div class="flex items-center space-x-2 rounded hover:bg-gray-200 p-2 cursor-pointer">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
          </span>
          <span>users</span>
        </div> -->

        {#each dataFilter as item (item.id)}
          <a href="/admin/{item.name}" class="flex items-center space-x-2 rounded hover:bg-gray-200 p-2 cursor-pointer">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 5h-8.586L9.707 3.293A.997.997 0 0 0 9 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z"></path></svg>
            </span>
            <span>{item.name}</span>
          </a>
        {/each}

        {#if dataFilter.length == 0}
          <div class='py-4 text-center'>
            No collections found.
          </div>
        {/if}

        <Button class="!mt-4" outline size="sm" on:click={() => collectionStore.openAddEditCollection()}>
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
          </span>
          <span>New collection</span>
        </Button>

        <ModalEditAddCollection bind:dataTypes={data.dataTypes} />
      </div>
    </div>
  </div>
  <div class="flex-grow min-w-0">
    <slot/>
  </div>
</div>