<script>
  import Alert from "$components/admin/Alert.svelte";
  import Loading from "$components/admin/Loading.svelte";
	import "../app.css";
</script>

<slot />
<Loading />
<Alert />

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</svelte:head>