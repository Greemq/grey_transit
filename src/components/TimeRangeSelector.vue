<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <CalendarIcon class="w-4 h-4 text-muted-foreground" />
        <span class="text-sm font-medium">Период анализа:</span>
      </div>

      <div class="select-wrapper">
        <select :value="value" @change="handleChange" class="select w-40">
          <option
            v-for="(label, key) in timeRangeLabels"
            :key="key"
            :value="key"
          >
            {{ label }}
          </option>
        </select>
      </div>
    </div>

    <div
      v-if="lastUpdated"
      class="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <ClockIcon class="w-4 h-4" />
      <span> Обновлено: {{ formatTime(lastUpdated) }} </span>
    </div>
  </div>
</template>

<script setup>
import CalendarIcon from "./icons/CalendarIcon.vue";
import ClockIcon from "./icons/ClockIcon.vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: "month",
  },
  lastUpdated: {
    type: Date,
    required: false,
  },
});

const emit = defineEmits(["update:value"]);

const timeRangeLabels = {
  day: "За день",
  week: "За неделю",
  month: "За месяц",
  quarter: "За квартал",
  "half-year": "За полгода",
  year: "За год",
};

const handleChange = (event) => {
  emit("update:value", event.target.value);
};

const formatTime = (date) => {
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
