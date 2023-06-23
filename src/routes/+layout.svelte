<script>
  import Alert from "$components/admin/Alert.svelte";
  import Loading from "$components/admin/Loading.svelte";
	import "../app.css";
</script>

<slot />
<Loading />
<Alert />