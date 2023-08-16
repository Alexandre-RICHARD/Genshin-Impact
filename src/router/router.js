// On importe les éléments utiles de Vue Router
import { createRouter, createWebHistory } from "vue-router";

import GenshinMenu from "@views/Page/GenshinMenu.vue";
import GenshinStatisfyer from "@views/Page/GenshinStatisfyer.vue";
import GenshinFarming from "@views/Page/GenshinFarming.vue";

// On importe toutes les vues qui seront utilisées par notre router principal


// On liste toutes les routes qui seront gérées par le router principal
const routes = [
    //HomePage
    {
        path: "/",
        name: "GenshinHome",
        components: { mainRouter: GenshinMenu },
        meta: {
            documentTitle: "Genshin - Fan Tool Site",
        },
    },
    //Curriculum
    {
        path: "/statisfyer",
        name: "Statisfyer",
        components: { mainRouter: GenshinStatisfyer },
        meta: {
            documentTitle: "Statisfyer",
        },
    },
    //Project
    {
        path: "/farming",
        name: "Farming",
        components: { mainRouter: GenshinFarming },
        meta: {
            documentTitle: "Optimiser son farming",
        },
    },
];

// On créé notre router en indiquand l'historique et le tableau des routes précédemment créées
const router = createRouter({
    history: createWebHistory(),
    routes,
    // Lors d'un changement de composant/page, le scrolling revient en haut automatiquement
    scrollBehavior() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ left: 0, top: 0, behavior: "smooth" });
            }, 200);
        });
    },
});

router.afterEach((to) => {
    document.title = to.meta.documentTitle;
});

// On exporte notre router afin de le récupérer à la création de l'app
export default router;
