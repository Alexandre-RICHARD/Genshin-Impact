<script setup>
import GenshinNavigation from "@parts/GenshinNavigation.vue";
</script>

<template>
    <GenshinNavigation />
    <main>
        <router-view name="mainRouter" />
    </main>
</template>

<style lang="scss">
@import "@styles/variables.scss";

#app {
    font-family: $kanit;
    width: 100%;
    min-width: 200px;
    min-height: 100vh;
    background-color: #25294a;
    color: #f5f5f5;
}
</style>
