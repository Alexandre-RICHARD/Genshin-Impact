<script setup>
import pjson from "@root/package.json";
</script>

<template>
    <footer class="footer-container">
        <div class="footer-content">
            <p>Site designé et créé par Alexandre Richard</p>
            <a
                href="https://github.com/Alexandre-RICHARD/Genshin-Impact"
                target="blank"
            >&gt; Répertoire Github &lt;</a>
            <a
                href="https://alexandre-richard.fr/"
                target="blank"
            >&gt; Mon portfolio &lt;</a>
            <p>Hébergé chez O2 Switch</p>
            <p class="versionning">Version {{ pjson.version }} datée du {{ pjson.versiondate }}</p>
        </div>
    </footer>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.footer-container {
    background-color: transparent;
    position: absolute;
    top: 0;
    right: 0;

    .footer-content {
        background-color: $color2;
        color: $color1;
        padding: 3px;
        border-radius: 0 0 0 25px;
        border: $color3 2px;
        border-bottom: solid;
        border-left: solid;
        display: flex;
        flex-direction: column;
        align-items: center;

        p {
            font-weight: 300;
            font-size: 11px;
        }

        a {
            font-size: 12px;
            font-weight: 400;
            text-decoration: underline;
    
            &:hover {
                letter-spacing: 0.5px;
            }
        }
    }
    
}
</style>
