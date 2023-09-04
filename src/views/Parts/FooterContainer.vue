<script setup>
import { reactive, ref } from "vue";
import { sendMessage } from "@middlewares/fetchHandler.js";
import pjson from "@root/package.json";

const isContactModalOpen = ref(false);

const contactFormValues = reactive({
    name: "",
    mail: "",
    subject: "",
    message: "",
});

const submitContactForm = (event) => {
    event.preventDefault();
    isContactModalOpen.value = false;
    sendMail();
};

const sendMail = async () => {
    try {
        await sendMessage(contactFormValues);
        contactFormValues.name = "";
        contactFormValues.mail = "";
        contactFormValues.subject = "";
        contactFormValues.message = "";
    } catch (error) {
        console.trace(error);
    }
};

const focus = reactive([false, false, false, false]);
const privacyPolicyOpen = ref(false);

</script>

<template>
    <div v-if="isContactModalOpen" class="opened-contact-modal">
        <div class="contact-me-container">
            <img class="close-button" src="@static/images/close.png" @click="isContactModalOpen = false">
            <h1 class="contact-me-title">
                Envoyer un message (je vous lirai avec attention)
            </h1>
            <form class="contact-me-form">
                <div class="one-input-container">
                    <div :class="{ 'is-focused': focus[0] || contactFormValues.name.length > 0 }" class="input">
                        <label>Votre nom (optionnel)</label>
                        <input
                            v-model="contactFormValues.name" type="text" @focus="focus[0] = true"
                            @blur="focus[0] = false"
                        >
                    </div>
                </div>
                <div class="one-input-container">
                    <div :class="{ 'is-focused': focus[1] || contactFormValues.mail.length > 0 }" class="input">
                        <label>Votre mail (optionnel)</label>
                        <input
                            v-model="contactFormValues.mail" type="text" @focus="focus[1] = true"
                            @blur="focus[1] = false"
                        >
                    </div>
                </div>
                <div class="one-input-container">
                    <div :class="{ 'is-focused': focus[2] || contactFormValues.subject.length > 0 }" class="input">
                        <label>L'objet du message</label>
                        <input
                            v-model="contactFormValues.subject" type="text" @focus="focus[2] = true"
                            @blur="focus[2] = false"
                        >
                        <span :class="{ 'long-enough': contactFormValues.subject.length >= 15 }" class="length">{{
                            contactFormValues.subject.length }} / 15
                        </span>
                    </div>
                </div>
                <div class="one-input-container">
                    <div :class="{ 'is-focused': focus[3] || contactFormValues.message.length > 0 }" class="input">
                        <label>Votre message</label>
                        <textarea
                            v-model="contactFormValues.message" type="text" @focus="focus[3] = true"
                            @blur="focus[3] = false"
                        />
                        <span :class="{ 'long-enough': contactFormValues.message.length >= 40 }" class="length">{{
                            contactFormValues.message.length }} / 40
                        </span>
                    </div>
                </div>
                <input
                    v-if="contactFormValues.message.length >= 40 && contactFormValues.subject.length >= 15"
                    class="submit-button" type="submit" value="Envoyer" @click="submitContactForm"
                >
            </form>
        </div>
    </div>
    <footer class="footer-container">
        <Transition name="sliding">
            <div v-if="privacyPolicyOpen" class="privacy-policy-open">
                <p>
                    Ce site web est une création indépendante par Alexandre RICHARD.
                    Il n'est en aucun cas affilié, sponsorisé ou soutenu par HoyoVerse, l'entreprise derrière le jeu Genshin
                    Impact. Tous les droits d'auteur et de propriété intellectuelle relatifs au jeu appartiennent à
                    HoyoVerse.
                    Aucune information personnelle identifiable n'est collectée. Seul un identifiant unique est utilisé pour
                    connecter l'utilisateur à ses données mais ne constitue pas une donnée personnelle sensible.
                </p>
                <br>
                <p>
                    Aussi, je tiens à préciser que je n'ai pas pour but de faire concurrence à l'excellent site Paimon.moe ni aucun autre d'ailleurs. L'outil que j'avais d'abord créer sur un Google Sheet n'existait nul part ailleurs et je voulais le partager avec la communauté donc le faire sur site web.
                </p>
            </div>
        </Transition>
        <div class="contact-me-button">
            <p>Un bug, une suggestion ?</p>
            <button class="footer-button" @click="isContactModalOpen = true">Contactez-moi</button>
        </div>
        <div class="project-infos">
            <p>Hébergé chez O2 Switch</p>
            <p class="versionning">Version {{ pjson.version }} datée du {{ pjson.versiondate }}</p>
        </div>
        <button class="privacy-policy footer-button" @click="privacyPolicyOpen = !privacyPolicyOpen">
            Politique de confidentialité
        </button>
        <div class="github-info">
            <a class="footer-button" href="https://github.com/Alexandre-RICHARD/Genshin-Impact" target="blank">Code source
                du projet</a>
            <a class="footer-button" href="https://github.com/Alexandre-RICHARD/Portfolio-Back" target="blank">
                Code source du serveur</a>
        </div>
        <div class="project-info">
            <a class="footer-button" href="https://alexandre-richard.fr" target="blank">Mon portfolio</a>
        </div>
    </footer>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.footer-container {
    position: relative;
    margin-top: auto;
    background-color: $color8;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 5px 70px;
    padding: 25px 40px;
    font-size: 14px;

    .privacy-policy-open {
        padding: 15px;
        position: absolute;
        width: 85%;
        max-width: 600px;
        top: -180%;
        border: 1px solid $color3;
    }

    .sliding-enter-active {
        animation: sliding 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
    }

    .sliding-leave-active {
        animation: sliding 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000) both reverse;
    }

    @keyframes sliding {
        0% {
            transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
            transform-origin: 50% 100%;
            filter: blur(40px);
            opacity: 0;
        }

        100% {
            transform: translateY(0) scaleY(1) scaleX(1);
            transform-origin: 50% 50%;
            filter: blur(0);
            opacity: 1;
        }
    }

    .contact-me-button {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .project-infos {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .privacy-policy {
        position: relative;
        color: $color3;
        text-align: justify;
    }

    .github-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: justify;
        max-width: 250px;
        gap: 12px;
    }

    .footer-button {
        font-weight: 400;
        text-decoration: underline 2px;
        text-underline-offset: 4px;

        &:hover {
            color: $color7;
        }
    }
}

.opened-contact-modal {
    z-index: $cache-z-index;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: $cache;
    display: flex;
    justify-content: center;
    align-items: center;

    .contact-me-container {
        position: relative;
        background-color: $color3;
        color: $color5;
        width: 98%;
        max-width: 450px;
        padding: 25px;
        border-radius: 15px 5px 15px 5px;
        box-shadow: inset 0 0 10px 1px #000000ad;

        .close-button {
            position: absolute;
            cursor: pointer;
            right: 15px;
            top: 12px;
            width: 26px;
            height: 26px;
            padding: 3px;

            &:hover {
                border-radius: 13px;
                background-color: $color11;
            }
        }

        .contact-me-title {
            width: 100%;
            text-align: center;
        }

        .contact-me-form {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            width: 100%;

            .one-input-container {
                padding-top: 10px;
                width: 100%;
                border-bottom: 3px solid $color11;

                .input {
                    position: relative;

                    label {
                        opacity: 0.6;
                        pointer-events: none;
                        position: absolute;
                        transform: translate3d(0, 0, 0) scale(1);
                        transform-origin: left top;
                        transition: transform ease .2s;
                        font-size: 16px;
                    }

                    input {
                        width: 100%;
                        display: flex;
                        margin: 10px 0;
                    }

                    textarea {
                        padding: 4px;
                        width: 100%;
                        min-height: 80px;
                        resize: vertical;
                    }
                }

                .length {
                    position: absolute;
                    right: 10px;
                    bottom: 5px;
                    font-size: 12px;
                    opacity: 0.7;
                }

                .length.long-enough {
                    color: $color11;
                }

                .input.is-focused label {
                    transform: translateY(-17px) scale(0.70);
                    opacity: 1;
                }
            }

            .submit-button {
                padding: 3px 12px;
                margin: auto;
                font-weight: 500;
                font-size: 20px;
                cursor: pointer;
                background-color: $color7;
                border-radius: 18px;
                transition: all 0.3s;

                &:hover {
                    padding: 3px 50px;
                }
            }
        }
    }
}

@media only screen and (min-width: 700px) {
    .footer-container {
        .privacy-policy-open {
            top: -200%;
        }
    }
}

@media only screen and (min-width: 1100px) {
    .footer-container {
        .privacy-policy-open {
            top: -280%;
        }
    }
}
</style>
