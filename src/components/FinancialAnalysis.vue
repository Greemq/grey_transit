<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    <div class="card xl:col-span-2">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <TrainIcon class="w-5 h-5" />
          Анализ вагонов по уровням риска
        </h3>
      </div>
      <div class="card-content">
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">
                {{ data.totalWagons.toLocaleString() }}
              </div>
              <div class="text-sm text-blue-700">Всего вагонов</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600">
                {{
                  (data.highRiskWagons + data.mediumRiskWagons).toLocaleString()
                }}
              </div>
              <div class="text-sm text-red-700">Под риском</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {{ data.lowRiskWagons.toLocaleString() }}
              </div>
              <div class="text-sm text-green-700">Безопасные</div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Высокий риск</span>
              <span class="text-sm text-muted-foreground"
                >{{ data.highRiskWagons.toLocaleString() }} вагонов</span
              >
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill bg-red-500"
                :style="{
                  width: `${(data.highRiskWagons / data.totalWagons) * 100}%`,
                }"
              ></div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Умеренный риск</span>
              <span class="text-sm text-muted-foreground"
                >{{ data.mediumRiskWagons.toLocaleString() }} вагонов</span
              >
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill bg-orange-500"
                :style="{
                  width: `${(data.mediumRiskWagons / data.totalWagons) * 100}%`,
                }"
              ></div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Низкий риск</span>
              <span class="text-sm text-muted-foreground"
                >{{ data.lowRiskWagons.toLocaleString() }} вагонов</span
              >
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill bg-green-500"
                :style="{
                  width: `${(data.lowRiskWagons / data.totalWagons) * 100}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <DollarSignIcon class="w-5 h-5" />
          Финансовые риски
        </h3>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <AlertTriangleIcon class="w-4 h-4 text-red-600" />
              <span class="font-medium text-red-800">Потенциальные потери</span>
            </div>
            <div class="text-2xl font-bold text-red-600">
              {{ formatCurrency(data.potentialLoss) }}
            </div>
            <div class="text-sm text-red-700 mt-1">
              {{ riskPercentage.toFixed(1) }}% от общего объема
            </div>
          </div>

          <div class="p-4 bg-gray-50 border rounded-lg">
            <div class="text-sm text-gray-600 mb-2">Стоимость за вагон</div>
            <div class="text-lg font-bold">
              ~{{ formatCurrency(data.avgLossPerWagon) }}
            </div>
          </div>

          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="text-sm text-blue-600 mb-2">Максимальные потери</div>
            <div class="text-lg font-bold text-blue-800">
              {{ formatCurrency(data.maxLoss) }}
            </div>
            <div class="text-sm text-blue-700 mt-1">При 100% потерь</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import TrainIcon from "./icons/TrainIcon.vue";
import DollarSignIcon from "./icons/DollarSignIcon.vue";
import AlertTriangleIcon from "./icons/AlertTriangleIcon.vue";

const props = defineProps({
  timeRange: {
    type: String,
    required: true,
  },
});

const getFinancialData = (timeRange) => {
  const multipliers = {
    day: 1,
    week: 7,
    month: 30,
    quarter: 90,
    "half-year": 180,
    year: 365,
  };

  const baseWagons = 1247;
  const wagonCost = 700000;
  const multiplier = multipliers[timeRange] || 1;

  const totalWagons = Math.floor(baseWagons * multiplier);
  const highRiskWagons = Math.floor(totalWagons * 0.35);
  const mediumRiskWagons = Math.floor(totalWagons * 0.23);
  const lowRiskWagons = totalWagons - highRiskWagons - mediumRiskWagons;

  return {
    totalWagons,
    highRiskWagons,
    mediumRiskWagons,
    lowRiskWagons,
    potentialLoss: (highRiskWagons + mediumRiskWagons) * wagonCost,
    maxLoss: totalWagons * wagonCost,
    avgLossPerWagon: wagonCost,
  };
};

const data = computed(() => getFinancialData(props.timeRange));

const riskPercentage = computed(
  () =>
    ((data.value.highRiskWagons + data.value.mediumRiskWagons) /
      data.value.totalWagons) *
    100
);

const formatCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(2)} млрд ₸`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} млн ₸`;
  } else {
    return `${amount.toLocaleString()} ₸`;
  }
};
</script>
