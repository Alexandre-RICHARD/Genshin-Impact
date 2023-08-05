<script setup>
import GenshinNavigation from "@parts/GenshinNavigation.vue";

const openPopup = () => {
    console.log("OK");
    const accountPopup = window.open("http://localhost:8080/account","_blank","height=500,width=420");
    accountPopup.opener.recover = () => {
        
    };
};

</script>

<template>
    <GenshinNavigation />
    <main>
        <router-view name="mainRouter" />
    </main>
    <a href="#" @click="openPopup">OPEN POPUP TO CONNECT</a>
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
