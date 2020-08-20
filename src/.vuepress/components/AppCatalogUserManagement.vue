<template>
  <div id="AppCatalogUserManagement">
    <catalog/>
  </div>
</template>

<script>
import CatalogItem from './AppCatalogParts/CatalogItem';

export default {
  name: "AppCatalogUserManagement",
  components: {
    catalog: CatalogItem
  }
}
</script>