<template>
  <div id="AppCatalogLoadTest">
    <catalog/>
  </div>
</template>

<script>
import CatalogItem from './AppCatalogParts/CatalogItem';

export default {
  name: "AppCatalogLoadTest",
  components: {
    catalog: CatalogItem
  }
}
</script>