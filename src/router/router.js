// On importe les éléments utiles de Vue Router
import { createRouter, createWebHistory } from "vue-router";

import EntryPage from "@views/Page/EntryPage.vue";

// On importe toutes les vues qui seront utilisées par notre router principal


// On liste toutes les routes qui seront gérées par le router principal
const routes = [
    // Page principale et unique pour le moment
    {
        path: "/",
        name: "test",
        components: { mainRouter: EntryPage },
        meta: {
            documentTitle: "Genshin Farm Calculator",
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
