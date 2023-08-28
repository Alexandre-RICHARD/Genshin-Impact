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
    background-color: $color1;
    color: $color3;
}
</style>
