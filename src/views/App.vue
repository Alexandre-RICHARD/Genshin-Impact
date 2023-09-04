<script setup>
import FooterContainer from "@parts/FooterContainer.vue";
</script>

<template>
    <header />
    <main>
        <router-view name="mainRouter" />
    </main>
    <FooterContainer />
</template>

<style lang="scss">
@import "@styles/variables.scss";

body,
#app {
    height: 100vh;

    #app {
        font-family: $kanit;
        width: 100%;
        min-width: 200px;
        color: $color3;
        background-color: $color17;
        display: flex;
        flex-direction: column;
    }
}
</style>
