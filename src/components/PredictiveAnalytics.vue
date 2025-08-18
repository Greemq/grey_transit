<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Предиктивная аналитика</h2>
        <p class="text-muted-foreground">
          Прогнозирование потерь от серого транзита на основе текущих трендов
        </p>
      </div>
      <div class="flex items-center gap-2">
        <CalculatorIcon class="w-5 h-5 text-muted-foreground" />
        <span class="text-sm text-muted-foreground">
          Базовая стоимость:
          {{ formatCurrency(baseMetrics.currentLossPerWagon) }}/вагон
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PredictionCard
        title="Прогноз на 1 год"
        period="Потенциальные потери за 12 месяцев"
        :scenarios="predictions.oneYear"
        :icon="CalendarIcon"
      />

      <PredictionCard
        title="Прогноз на 5 лет"
        period="Накопительные потери за период"
        :scenarios="{
          optimistic: predictions.fiveYears.optimistic,
          realistic: predictions.fiveYears.realistic,
          pessimistic: predictions.fiveYears.pessimistic,
        }"
        :icon="TargetIcon"
      />
    </div>

    <div class="tabs w-full" v-if="false">
      <div class="tabs-list grid w-full max-w-md grid-cols-3">
        <button
          @click="activeTab = 'yearly'"
          :class="['tab-trigger', { active: activeTab === 'yearly' }]"
        >
          По годам
        </button>
        <button
          @click="activeTab = 'monthly'"
          :class="['tab-trigger', { active: activeTab === 'monthly' }]"
        >
          По месяцам
        </button>
        <button
          @click="activeTab = 'cumulative'"
          :class="['tab-trigger', { active: activeTab === 'cumulative' }]"
        >
          Накопительно
        </button>
      </div>

      <div class="tab-content space-y-4">
        <div v-if="activeTab === 'yearly'">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Прогноз потерь по годам</h3>
              <p class="text-sm text-muted-foreground">
                Сравнение сценариев развития ситуации на 5 лет
              </p>
            </div>
            <div class="card-content">
              <div class="chart-container h-[400px]">
                <canvas ref="yearlyChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'monthly'">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div v-for="scenario in scenarios" :key="scenario" class="card">
              <div class="card-header">
                <h3 class="card-title flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: scenarioColors[scenario] }"
                  ></div>
                  {{ scenarioLabels[scenario] }} сценарий
                </h3>
              </div>
              <div class="card-content">
                <div class="chart-container h-[250px]">
                  <canvas :ref="`monthlyChart${scenario}`"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'cumulative'">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Накопительные потери</h3>
              <p class="text-sm text-muted-foreground">
                Сумма потерь нарастающим итогом за 5 лет
              </p>
            </div>
            <div class="card-content">
              <div class="chart-container h-[400px]">
                <canvas ref="cumulativeChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title flex items-center gap-2">
            <TrendingUpIcon class="w-5 h-5" />
            Ключевые индикаторы
          </h3>
        </div>
        <div class="card-content">
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Критический порог</div>
                <div class="text-sm text-muted-foreground">
                  Максимальные потери за год
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-red-600">
                  {{ formatCurrency(predictions.oneYear.pessimistic.loss) }}
                </div>
                <div class="text-sm text-red-600">
                  {{ formatNumber(predictions.oneYear.pessimistic.wagons) }}
                  вагонов
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Целевой показатель</div>
                <div class="text-sm text-muted-foreground">
                  При улучшении контроля
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-600">
                  {{ formatCurrency(predictions.oneYear.optimistic.loss) }}
                </div>
                <div class="text-sm text-green-600">
                  {{ formatNumber(predictions.oneYear.optimistic.wagons) }}
                  вагонов
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
            >
              <div>
                <div class="font-medium">Экономический эффект</div>
                <div class="text-sm text-muted-foreground">
                  Разница между сценариями
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-blue-600">
                  {{
                    formatCurrency(
                      predictions.oneYear.pessimistic.loss -
                        predictions.oneYear.optimistic.loss
                    )
                  }}
                </div>
                <div class="text-sm text-blue-600">Потенциальная экономия</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title flex items-center gap-2">
            <AlertTriangleIcon class="w-5 h-5" />
            Рекомендации по периодам
          </h3>
        </div>
        <div class="card-content">
          <div class="space-y-3">
            <div class="p-3 border-l-4 border-green-500 bg-green-50">
              <div class="font-medium text-green-800">
                Краткосрочные меры (1-3 месяца)
              </div>
              <div class="text-sm text-green-700">
                Усиление контроля может предотвратить потери до
                {{
                  formatCurrency(
                    baseMetrics.monthlyHighRisk *
                      baseMetrics.wagonRiskRatio *
                      baseMetrics.currentLossPerWagon *
                      3 *
                      0.3
                  )
                }}
                за квартал
              </div>
            </div>

            <div class="p-3 border-l-4 border-blue-500 bg-blue-50">
              <div class="font-medium text-blue-800">
                Среднесрочные меры (6-12 месяцев)
              </div>
              <div class="text-sm text-blue-700">
                Автоматизация может сэкономить до
                {{ formatCurrency(predictions.oneYear.realistic.loss * 0.25) }}
                в год
              </div>
            </div>

            <div class="p-3 border-l-4 border-purple-500 bg-purple-50">
              <div class="font-medium text-purple-800">
                Долгосрочные меры (1-5 лет)
              </div>
              <div class="text-sm text-purple-700">
                Системный подход может предотвратить потери до
                {{
                  formatCurrency(
                    predictions.fiveYears.pessimistic[4].cumulativeLoss -
                      predictions.fiveYears.optimistic[4].cumulativeLoss
                  )
                }}
                за 5 лет
              </div>
            </div>

            <div class="p-3 border-l-4 border-red-500 bg-red-50">
              <div class="font-medium text-red-800">Критические риски</div>
              <div class="text-sm text-red-700">
                Без мер за 5 лет потери могут составить
                {{
                  formatCurrency(
                    predictions.fiveYears.pessimistic[4].cumulativeLoss
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import CalculatorIcon from "./icons/CalculatorIcon.vue";
import CalendarIcon from "./icons/CalendarIcon.vue";
import TargetIcon from "./icons/TargetIcon.vue";
import TrendingUpIcon from "./icons/TrendingUpIcon.vue";
import AlertTriangleIcon from "./icons/AlertTriangleIcon.vue";
import PredictionCard from "./PredictionCard.vue";

const props = defineProps({
  timeRange: {
    type: Object,
    required: true,
  },
});

const activeTab = ref("yearly");

const scenarios = ["optimistic", "realistic", "pessimistic"];

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

const baseMetrics = {
  currentLossPerWagon: 700000, // тенге за вагон
  monthlyHighRisk: 438, // случаев высокого риска за месяц
  monthlyMediumRisk: 291, // случаев умеренного риска за месяц
  monthlyGrowthRate: 0.023, // 2.3% месячный рост
  wagonRiskRatio: 0.7, // 70% случаев затрагивают вагоны
};

const calculatePredictions = (timeRange) => {
  const {
    currentLossPerWagon,
    monthlyHighRisk,
    monthlyMediumRisk,
    monthlyGrowthRate,
    wagonRiskRatio,
  } = baseMetrics;

  const scenarioMultipliers = {
    optimistic: 0.7,
    realistic: 1.0,
    pessimistic: 1.4,
  };

  const generateYearlyPrediction = (scenario, years) => {
    const multiplier = scenarioMultipliers[scenario];
    const data = [];

    for (let year = 1; year <= years; year++) {
      const monthlyRiskWagons =
        (monthlyHighRisk + monthlyMediumRisk) * wagonRiskRatio;
      const growthFactor = Math.pow(1 + monthlyGrowthRate, year * 12);
      const yearlyWagons = Math.floor(
        monthlyRiskWagons * 12 * growthFactor * multiplier
      );
      const yearlyLoss = yearlyWagons * currentLossPerWagon;

      data.push({
        year: `Год ${year}`,
        yearNumber: year,
        wagons: yearlyWagons,
        loss: yearlyLoss,
        cumulativeLoss:
          data.length > 0
            ? data[data.length - 1].cumulativeLoss + yearlyLoss
            : yearlyLoss,
      });
    }

    return data;
  };

  return {
    oneYear: {
      optimistic: generateYearlyPrediction("optimistic", 1)[0],
      realistic: generateYearlyPrediction("realistic", 1)[0],
      pessimistic: generateYearlyPrediction("pessimistic", 1)[0],
    },
    fiveYears: {
      optimistic: generateYearlyPrediction("optimistic", 5),
      realistic: generateYearlyPrediction("realistic", 5),
      pessimistic: generateYearlyPrediction("pessimistic", 5),
    },
  };
};

const predictions = computed(() => calculatePredictions(props.timeRange));

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

onMounted(() => {
  console.log("Инициализация графиков предиктивной аналитики");
});
</script>
