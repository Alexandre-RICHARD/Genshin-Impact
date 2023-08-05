<script setup>

</script>

<template>
    <div class="genshin-navigation-box">
        <router-link class="genshin-navigation" :to="{ name: 'Statisfyer' }">Statisfyer</router-link>
        <router-link class="genshin-navigation" :to="{ name: 'Farming' }">Farming</router-link>
    </div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.genshin-navigation-box {
    background-color: #393d64;
    margin: auto;
    width: 60%;
    display: flex;
    justify-content: space-around;
    font-size: 22px;
    border-radius: 0 0 40px 40px;

    .genshin-navigation {
        position: relative;
        width: 100%;
        padding: 25px 0;
        border-radius: 0 0 40px 40px;
        text-align: center;

        &:after {
            content: "";
            position: absolute;
            transform: scaleX(0);
            border-radius: 0 0 40px 40px;
            right: 0;
            top: 0;
            bottom: 0;
            left: 0;
            background-color: #181a2c46;
            transform-origin: center center;
            transition: transform 0.25s ease-out;
        }

        &:first-child:after {
            transform-origin: right center;
        }

        &:last-child:after {
            transform-origin: left center;
        }

        &:hover::after {
            transform: scaleX(1);
            transform-origin: center center;
        }

        &:first-child:hover::after {
            transform-origin: left center;
        }

        &:last-child:hover::after {
            transform-origin: right center;
        }
    }
}
</style>
