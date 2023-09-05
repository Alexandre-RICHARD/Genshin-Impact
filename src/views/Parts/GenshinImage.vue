<script setup>
defineProps({
    type: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
    },
    rarity: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <img
        class="genshin-image"
        :src="require(`@static/images/genshin_icon/${type}/${identifier}.png`)"
        :style="{ backgroundImage: `url('${require(`@static/images/genshin_icon/rarity/r-${rarity}.png`)}')` }"
    >
</template>