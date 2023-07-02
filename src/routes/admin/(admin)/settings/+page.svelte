<script>
  import { Button, TabItem, Tabs } from "flowbite-svelte";
</script>

<div class="w-full h-full p-6 overflow-y-auto flex flex-col space-y-6">
  <section class="flex items-center space-x-4">
    <div class="text-xl">
      <span class="text-gray-500">Settings</span>
      <span class="px-3 select-none">/</span>
      <span>Application</span>
    </div>

    <div class="!ml-auto" />
    <Button outline>
      <span class="material-symbols-outlined">add</span>
      <span>&nbsp;New Config</span>
    </Button>
    <Button>
      <span class="material-symbols-outlined">add</span>
      <span>&nbsp;New Group Config</span>
    </Button>
  </section>

  <section class="w-full">
    <div class="flex flex-wrap space-x-2 font-semibold text-gray-500 text-sm">
      <button
        class="p-4 hover:bg-gray-200 rounded-t-lg text-primary-700 bg-gray-200"
        >Admin</button
      >
      <button
        class="p-4 hover:bg-gray-200 rounded-t-lg"
        >Website</button
      >
      <button
        class="p-4 hover:bg-gray-200 rounded-t-lg"
        >Social Network</button
      >
    </div>
    <div class="h-px bg-gray-200 dark:bg-gray-700" />

    <div class="mt-4">
      <div class="w-full bg-white rounded-lg p-6 shadow-sm border">
        <form action="" class="flex flex-col space-y-4">
          <div class="flex flex-col justify-center items-center">
            <p class="p-4 text-center">There are no configuration settings</p>
            <Button outline size="sm">
              <span class="material-symbols-outlined">add</span>
              new config
            </Button>
          </div>
          <div class="flex justify-end">
            <Button disabled>Save changed</Button>
          </div>
        </form>
      </div>
    </div>
  </section>
</div>
