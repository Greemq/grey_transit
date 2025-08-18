<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="space-y-4">
      <h3 class="text-lg font-semibold mb-4">Ключевые показатели</h3>
      <div v-for="(kpi, index) in kpiData" :key="index" class="card">
        <div class="card-content p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <div :class="kpi.color">
                <component :is="kpi.icon" class="w-5 h-5" />
              </div>
              <span class="text-sm font-medium">{{ kpi.title }}</span>
            </div>
            <div class="flex items-center gap-1">
              <TrendingUpIcon
                :class="`w-3 h-3 ${
                  kpi.trend > 0 ? 'text-green-500' : 'text-red-500'
                }`"
              />
              <span
                :class="`text-xs ${
                  kpi.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`"
              >
                {{ kpi.trend > 0 ? "+" : "" }}{{ kpi.trend }}%
              </span>
            </div>
          </div>
          <div class="flex items-baseline gap-1 mb-2">
            <span class="text-2xl font-bold">{{ kpi.value }}</span>
            <span class="text-sm text-muted-foreground">{{ kpi.unit }}</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="kpi.bg_color"
              :style="{ width: `${(kpi.value / kpi.target) * 100}%` }"
            ></div>
          </div>
          <div class="text-xs text-muted-foreground mt-1">
            Цель: {{ kpi.target }}{{ kpi.unit }}
          </div>
        </div>
      </div>
    </div>

    <div class="card lg:col-span-2">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <GlobeIcon class="w-5 h-5" />
          Региональная аналитика
        </h3>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div
            v-for="(region, index) in regionalStats"
            :key="index"
            class="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
              >
                <GlobeIcon class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 class="font-medium">{{ region.region }}</h4>
                <p class="text-sm text-muted-foreground">
                  {{ region.total }} операций обработано
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center gap-2 mb-1">
                <div
                  :class="[
                    'badge',
                    region.percentage > 40
                      ? 'badge-destructive'
                      : 'badge-secondary',
                  ]"
                >
                  {{ region.high }} высокий риск
                </div>
              </div>
              <div class="text-lg font-bold text-primary">
                {{ region.percentage }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CheckCircleIcon from "./icons/CheckCircleIcon.vue";
import ClockIcon from "./icons/ClockIcon.vue";
import AlertCircleIcon from "./icons/AlertCircleIcon.vue";
import TrendingUpIcon from "./icons/TrendingUpIcon.vue";
import GlobeIcon from "./icons/GlobeIcon.vue";

const kpiData = [
  {
    title: "Эффективность обнаружения",
    value: 94.2,
    target: 95,
    unit: "%",
    trend: 2.1,
    icon: CheckCircleIcon,
    color: "text-green-600",
    bg_color: "bg-green-600",
  },
  {
    title: "Среднее время обработки",
    value: 2.3,
    target: 3,
    unit: "мин",
    trend: -0.8,
    icon: ClockIcon,
    color: "text-blue-600",
    bg_color: "bg-blue-600",
  },
  {
    title: "Ложные срабатывания",
    value: 5.8,
    target: 5,
    unit: "%",
    trend: 0.3,
    icon: AlertCircleIcon,
    color: "text-orange-600",
    bg_color: "bg-orange-600",
  },
];

const regionalStats = [
  { region: "СНГ", total: 856, high: 420, percentage: 49 },
  { region: "ЕС", total: 234, high: 89, percentage: 38 },
  { region: "Азия", total: 123, high: 45, percentage: 37 },
  { region: "Другие", total: 87, high: 28, percentage: 32 },
];
</script>
