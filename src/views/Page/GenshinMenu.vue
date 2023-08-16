<script setup>
import { ref } from "vue";

let visibility = ref(false);

var popup;

const openIframe = () => {
    visibility.value = !visibility.value;
};

const openPopup = () => {
    popup = window.open("http://localhost:8080/account", "_blank", "height=500,width=420");
    popup.focus();
};

</script>

<template>
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
    <p id="testPopup">Iframe Idiot</p>s
</template>

<style lang="scss">
@import "@styles/variables.scss";

.iframe {
    position: static;
    width: 100%;
}

.hidden {
    display: none;
}
</style>
