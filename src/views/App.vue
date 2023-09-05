<script setup>
import HeaderContainer from "@parts/HeaderContainer.vue";
import FooterContainer from "@parts/FooterContainer.vue";
</script>

<template>
    <HeaderContainer />
    <main>
        <router-view name="mainRouter" />
    </main>
    <FooterContainer />
</template>

<style lang="scss">
@import "@styles/variables.scss";

body,
#app {
    min-height: 100vh;

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
