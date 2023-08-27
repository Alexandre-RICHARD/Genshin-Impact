<script setup>
import FooterContainer from "@parts/FooterContainer.vue";
</script>

<template>
    <main>
        <router-view name="mainRouter" />
    </main>
    <FooterContainer />
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
