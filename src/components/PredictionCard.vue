<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title flex items-center gap-2">
        <component :is="icon" class="w-5 h-5" />
        {{ title }}
      </h3>
      <p class="text-sm text-muted-foreground">{{ period }}</p>
    </div>
    <div class="card-content">
      <div class="space-y-4">
        <div
          v-for="[scenario, data] in Object.entries(scenarios)"
          :key="scenario"
          class="space-y-2"
        >
          <div class="flex items-center justify-between">
            <div
              class="badge badge-outline"
              :style="{
                borderColor: scenarioColors[scenario],
                color: scenarioColors[scenario],
              }"
            >
              {{ scenarioLabels[scenario] }}
            </div>
            <div class="text-right">
              <div class="font-semibold text-lg">
                {{
                  formatCurrency(
                    Array.isArray(data)
                      ? data[data.length - 1].cumulativeLoss
                      : data.loss
                  )
                }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{
                  formatNumber(
                    Array.isArray(data)
                      ? data[data.length - 1].wagons
                      : data.wagons
                  )
                }}
                вагонов
              </div>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">
            {{ scenarioDescriptions[scenario] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  period: String,
  scenarios: {
    type: Object,
    required: true,
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
});

const scenarioLabels = {
  optimistic: "Оптимистичный",
  realistic: "Реалистичный",
  pessimistic: "Пессимистичный",
};

const scenarioColors = {
  optimistic: "#16a34a",
  realistic: "#3b82f6",
  pessimistic: "#dc2626",
};

const scenarioDescriptions = {
  optimistic: "Улучшение контроля, снижение рисков на 30%",
  realistic: "Текущие тренды продолжаются без изменений",
  pessimistic: "Ухудшение ситуации, рост рисков на 40%",
};

const formatCurrency = (amount) => {
  if (amount >= 1000000000000) {
    return `${(amount / 1000000000000).toFixed(2)} трлн ₸`;
  } else if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(2)} млрд ₸`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} млн ₸`;
  } else {
    return `${amount.toLocaleString()} ₸`;
  }
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}М`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}К`;
  } else {
    return num.toLocaleString();
  }
};
</script>
