<script setup>
defineProps({
    type: {
        type: String,
        required: true,
    },
    group: {
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
            @change="$emit('update:checked', group, index, valuename, $event.target.checked)"
        >
    </td>

    <td v-if="type === 'select-level'">
        <select :value="value" class="select" @change="$emit('update:value', group, index, valuename, parseInt($event.target.value))">
            <option v-for="lvl in list" :key="lvl.id" :value="lvl.id">
                {{ lvl.level }}
            </option>
            {{ list.find(el => el.id === value).level }}
        </select>
    </td>

    <td v-if="type === 'select-aptitude'">
        <select :value="value" class="select" @change="$emit('update:value', group, index, valuename, parseInt($event.target.value))">
            <option v-for="lvl in list" :key="lvl" :value="lvl">
                {{ lvl }}
            </option>
            {{ value }}
        </select>
    </td>
    
    <td v-if="type === 'number'">
        <input
            type="number" min="0" step="1" :value="value"
            class="number" @change="$emit('update:value', group, index, valuename, parseInt($event.target.value))"
        >
    </td>
</template>