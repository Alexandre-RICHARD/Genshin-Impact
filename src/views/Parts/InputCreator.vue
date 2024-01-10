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
        default: () => { },
    },
});
defineEmits(["update:checked", "update:value"]);
</script>

<template>
    <td v-if="type === 'checkbox'">
        <input
            class="checkbox" type="checkbox" :checked="checked" :disabled="disabled"
            @change="$emit('update:checked', $event.target.checked)"
        >
    </td>

    <td v-if="type === 'select-level'">
        <select :value="value" class="select" @change="$emit('update:value', parseInt($event.target.value))">
            <option v-for="lvl in list" :key="lvl.id" :value="lvl.id">
                {{ lvl.level }}
            </option>
            {{ list.find(el => el.id === value).level }}
        </select>
    </td>

    <td v-if="type === 'select-aptitude'">
        <select :value="value" class="select" @change="$emit('update:value', parseInt($event.target.value))">
            <option v-for="lvl in list" :key="lvl" :value="lvl">
                {{ lvl }}
            </option>
            {{ value }}
        </select>
    </td>

    <td v-if="type === 'number'">
        <input
            type="number" min="0" step="1" max="1000000000"
            :value="value" class="number"
            @change="$emit('update:value', parseInt($event.target.value))"
        >
    </td>
</template>

<style lang="scss">
@import "@styles/variables.scss";

td {
    .checkbox {
        appearance: none;
        width: 22px;
        height: 22px;
        border: 2px solid $color8;
        border-radius: 3px;
        display: grid;
        place-content: center;
        margin: auto;
    }

    .checkbox:checked {
        background-color: $color2;
    }

    .checkbox::before {
        content: "";
        width: 14px;
        height: 14px;
        transform: scale(0);
        box-shadow: inset 14px 14px $color4;
        transition: 0.15s transform ease-in-out;
    }

    .checkbox:checked::before {
        transform: scale(1);
    }

    .checkbox:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .select {
        appearance: menulist-button;
        padding: 3px 0px;
        text-align: center;
        border-radius: 6px;
        box-shadow: 0px 0px 4px 0px #000000 inset;
        font-weight: 400;
        font-size: 18px;
        width: 100%;

        option {
            color: $color8;
            background-color: $color14;
        }

        &:hover {
            cursor: pointer;
            background-color: $color17;
            color: $color3;
        }
    }

    .number {
        font-weight: 400;
        font-size: 18px;
        box-shadow: 0px 0px 4px 0px #000000 inset;
        padding: 3px 0px;
        text-align: center;
        border-radius: 6px;
        width: 100%;
    }
}

.have-and-done {
    .checkbox {
        opacity: 0.6;
    }

    .checkbox:checked {
        background-color: $color10;
    }

    .checkbox::before {
        box-shadow: inset 14px 14px $color18;
    }

    .select {
        opacity: 0.6;
    }
}
</style>