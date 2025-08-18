<template>
  <div class="flex items-center gap-2">
    <div :class="['badge', badgeConfig.color]">
      {{ badgeConfig.label }} ({{ probability }}%)
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  riskLevel: {
    type: String,
    required: true,
    validator: (value) =>
      ["high", "medium-high", "medium", "low"].includes(value),
  },
  probability: {
    type: Number,
    required: true,
  },
});

const badgeConfig = computed(() => {
  const variants = {
    high: { label: "Высокий", color: "bg-red-100 text-red-800" },
    "medium-high": {
      label: "Умеренно высокий",
      color: "bg-orange-100 text-orange-800",
    },
    medium: { label: "Средний", color: "bg-yellow-100 text-yellow-800" },
    low: { label: "Низкий", color: "bg-green-100 text-green-800" },
  };

  return variants[props.riskLevel];
});
</script>
