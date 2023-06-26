<script lang="ts">
  import moment from 'moment'
  
  export let value:string

  const date = moment(value)
  const formattedDate = date.format('YYYY-MM-DD')
  const formattedTime = date.format('HH:mm:ss');
</script>

<div class="whitespace-nowrap text-center">
  <p class="text-sm">{formattedDate}</p>
  <p class='text-gray-500 text-xs'>{formattedTime}</p>
</div>