<script lang="ts">
  import type { FieldNameType } from '$lib/admin/fields';
  import { clickOutside } from '$lib/utils/clickOutSide';
  import type { DataRow, DataType } from '@prisma/client';
  import { Drawer, Button, CloseButton } from 'flowbite-svelte'
  import { sineIn } from 'svelte/easing';


  type DataFieldType = (Omit<DataRow, 'field'> & {
    value: any
    field: FieldNameType
  })[]

  export let hidden = true


  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  }

  const handelSubmit = async () => {

  }
</script>

<Drawer placement='right' transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={hidden} id='editAddCollection'
  width="w-[700px]"
  divClass="overflow-y-auto z-50 p-0 bg-white dark:bg-gray-800 fixed inset-y-0 right-0"
>
  <form class='w-full max-w-[100vw] flex flex-col h-full' on:submit|preventDefault={handelSubmit}>
    <div class="flex-none bg-gray-100 py-6 px-8">
      <h3 class='text-xl'>New Collection</h3>
      <!-- <  id="name" name='name' required placeholder='eg. "posts' class='mt-6' /> -->
    </div>

    <div class="flex-grow min-h-0 overflow-y-auto py-6 px-8 flex flex-col space-y-4">
      <span class='text-sm'>System fields: 
        <span class="px-1 text-xs bg-primary-200 rounded">id</span>,
        <span class="px-1 text-xs bg-primary-200 rounded">createdAt</span>,
        <span class="px-1 text-xs bg-primary-200 rounded">updatedAt</span>.
      </span>
      <!-- {data.map(v => {
        switch(v.field) {
          case 'Plain text':
            return <AdminAddFieldText key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Rich text':
            return <AdminAddFieldRichText key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Number':
            return <AdminAddFieldNumber key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Bool':
            return <AdminAddFieldBool key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Email':
            return <AdminAddFieldEmail key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Url':
            return <AdminAddFieldUrl key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'DateTime':
            return <AdminAddFieldDateTime key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Select':
            return <AdminAddFieldSelect key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'File':
            return <AdminAddFieldFile key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'Relation':
            return <AdminAddFieldRelation key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          case 'JSON':
            return <AdminAddFieldJson key={v.id} onChange={(e) => onChangeField(e, v.id)} onDelete={() => onDeleteField(v.id)} />
          default:
            return null;
        }
      })} -->
      <!-- <Button class='w-full' variant="outlined" style={{borderWidth: 2, borderColor: grey[900]}} startIcon={(
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
        </span>
      )} onClick={handleClick}>
        New Fields
      </Button>
      <Menu
        MenuListProps={{
          // "aria-labelledby": "basic-button",
          sx: { width: widthFileds }
        }}
        anchorEl={anchorEl}
        open={openFileds}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div class="w-full grid grid-cols-4 px-2 text-sm">
          {DATA_FIELDS.filter(v => v.fieldName != "ID").map((v,i) =>
            <div key={i} class="px-2 py-2 rounded flex items-center space-x-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => addField(v.fieldName)}
            >
              <span class="icon" dangerouslySetInnerHTML={{__html: v.icon}}></span>
              <span>{v.fieldName}</span>
            </div>
          )}
        </div>
      </Menu> -->
    </div>

    <div class="flex-none py-6 px-8 flex justify-end space-x-4 border-t">
      <Button variant="text" onClick={() => hidden = true}>Cancel</Button>
      <Button variant="contained" type='submit'>Create</Button>
    </div>
  </form>
</Drawer>