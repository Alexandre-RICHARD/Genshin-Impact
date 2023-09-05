<script setup>
import GenshinLogo from "@svgs/GenshinLogo.vue";
import GenshinLogoPerso from "@svgs/GenshinLogoPerso.vue";

</script>

<template>
    <header class="header-container">
        <div class="logo-container">
            <GenshinLogo />
            <GenshinLogoPerso />
        </div>
    </header>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.header-container {
    position: relative;
    margin-top: 0 auto;
    background-color: $color8;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    font-size: 14px;
    min-height: 80px;

    .logo-container {
        position: relative;
        padding: 5px;
        background-color: transparent;
        width: 194.85px;
        height: 100%;

        svg {
            position: absolute;
            height: 70px;
            width: 194.85px;
            pointer-events: none;

            path {
                fill: $color3;
                pointer-events: none;
            }

            .official-logo {
                animation: logo-animation 7s ease-in-out both infinite alternate;
            }

            .personal-logo {
                animation: logo-animation 7s ease-in-out both infinite alternate-reverse;
            }

            @keyframes logo-animation {
                0% {
                    opacity: 1;
                }

                43% {
                    opacity: 1;
                }

                50% {
                    opacity: 0.8;
                }

                57% {
                    opacity: 0;
                }

                100% {
                    opacity: 0;
                }
            }
        }

        &:hover {
            svg {
                path {
                    fill: url(#svg-gradient) #fff;
                }
            }
        }
    }
}
</style>
