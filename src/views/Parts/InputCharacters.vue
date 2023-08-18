<script setup>
defineProps({
    type: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        default: 1,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    list: {
        type: Array,
        default: () => {},
    },
    valuename: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    }
});
defineEmits(["update:checked", "update:value"]);
</script>

<template>
    <td v-if="type === 'checkbox'">
        <input
            class="checkbox"
            type="checkbox"
            :checked="checked"
            :disabled="disabled"
            @change="$emit('update:checked', index, valuename, $event.target.checked)"
        >
    </td>
    <td v-if="type === 'select'">
        <select :value="value" class="select" @change="$emit('update:value', index, valuename, parseInt($event.target.value))">
            <option v-for="lvl in list" :key="lvl" :value="lvl">
                {{ lvl }}
            </option>
            {{ value }}
        </select>
    </td>
</template>