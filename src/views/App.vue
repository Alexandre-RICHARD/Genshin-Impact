<script setup>
import { ref } from "vue";
import GenshinNavigation from "@parts/GenshinNavigation.vue";

let visibility = ref(false);

var popup;

const openIframe = () => {
    visibility.value = !visibility.value;
};

const openPopup = () => {
    popup = window.open("http://localhost:8080/account","_blank","height=500,width=420");
    popup.focus();
};

</script>

<template>
    <GenshinNavigation />
    <main>
        <router-view name="mainRouter" />
    </main>
    <a href="#" @click="openPopup">
        OPEN POPUP TO CONNECT
    </a>
    <p id="testPopup">Idiot</p>
    <a href="#" @click="openIframe">
        OPEN IFRAME TO CONNECT
    </a>
    <iframe 
        id="IframeTest"
        name="iframeTest"
        class="iframe"
        :class="{ hidden: !visibility }"
        width="500"
        height="420"
        src="http://localhost:8080/account"
    />
    <p id="testPopup">Iframe Idiot</p>
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

    .iframe {
        position: static;
        width: 100%;
    }

    .hidden {
        display: none;
    }
}
</style>
