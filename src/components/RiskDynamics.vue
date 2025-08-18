<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <ActivityIcon class="w-5 h-5 text-blue-500" />
          Динамика выявленных рисков по дням
        </h3>
        <p class="text-muted-foreground mt-1">
          Детальная статистика обнаружения рисков за выбранный период
        </p>
      </div>

      <div class="flex items-center gap-2">
        <select v-model="chartType" class="select w-32">
          <option value="line">Линия</option>
          <option value="bar">Столбцы</option>
          <option value="area">Область</option>
        </select>

        <button
          @click="viewType = viewType === 'chart' ? 'table' : 'chart'"
          class="btn btn-outline btn-sm"
        >
          <BarChart3Icon v-if="viewType === 'chart'" class="w-4 h-4" />
          <ActivityIcon v-else class="w-4 h-4" />
        </button>

        <button class="btn btn-outline btn-sm">
          <DownloadIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="tabs w-full">
      <div
        class="tabs-list inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      >
        <button
          @click="viewType = 'chart'"
          :class="['tab-trigger', { active: viewType === 'chart' }]"
        >
          График
        </button>
        <button
          @click="viewType = 'table'"
          :class="['tab-trigger', { active: viewType === 'table' }]"
        >
          Таблица
        </button>
      </div>

      <div class="tab-content mt-4">
        <!-- Chart View -->
        <div v-if="viewType === 'chart'" class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <h3 class="card-title">Динамика рисков по дням</h3>
              <div class="flex items-center gap-2">
                <span
                  class="badge"
                  :class="getTrendBadgeClass(summary.trendDirection)"
                >
                  {{ getTrendLabel(summary.trendDirection) }}
                </span>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="chart-container h-[400px]">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="card">
          <div class="card-header">
            <h3 class="card-title">Детализированная статистика по дням</h3>
          </div>
          <div class="card-content">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left p-2">Дата</th>
                    <th class="text-center p-2">Высокий</th>
                    <th class="text-center p-2">Умеренно высокий</th>
                    <th class="text-center p-2">Средний</th>
                    <th class="text-center p-2">Низкий</th>
                    <th class="text-center p-2">Всего рисков</th>
                    <th class="text-center p-2">% риска</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="day in reversedData"
                    :key="day.date"
                    class="border-b hover:bg-muted/50"
                  >
                    <td class="p-2 font-medium">
                      {{ formatDate(day.date) }}
                    </td>
                    <td class="text-center p-2">{{ day.highRisk }}</td>
                    <td class="text-center p-2">{{ day.mediumHighRisk }}</td>
                    <td class="text-center p-2">{{ day.mediumRisk }}</td>
                    <td class="text-center p-2">{{ day.lowRisk }}</td>
                    <td class="text-center p-2 font-semibold">
                      {{ day.totalRisks }}
                    </td>
                    <td class="text-center p-2">
                      <span :class="getRiskPercentageClass(day.riskPercentage)">
                        {{ day.riskPercentage }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement,
} from "chart.js";

// Icons
import ActivityIcon from "./icons/ActivityIcon.vue";
import BarChart3Icon from "./icons/BarChart3Icon.vue";
import DownloadIcon from "./icons/DownloadIcon.vue";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarController,
  BarElement
);

const props = defineProps({
  timeRange: { type: String, default: "month" },
});

const viewType = ref("chart");
const chartType = ref("line");
const chartCanvas = ref(null);
const chartInstance = ref(null);

const generateDailyData = (timeRange) => {
  const days =
    timeRange === "week"
      ? 7
      : timeRange === "month"
      ? 30
      : timeRange === "year"
      ? 365
      : 10;

  const today = new Date();
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const highRisk = 10 + Math.floor(Math.random() * 15);
    const mediumHighRisk = 5 + Math.floor(Math.random() * 10);
    const mediumRisk = 3 + Math.floor(Math.random() * 8);
    const lowRisk = 2 + Math.floor(Math.random() * 6);

    const totalRisks = highRisk + mediumHighRisk;

    data.push({
      date: date.toISOString().split("T")[0],
      highRisk,
      mediumHighRisk,
      mediumRisk,
      lowRisk,
      totalRisks,
      riskPercentage: Math.round(
        (totalRisks / (highRisk + mediumHighRisk + mediumRisk + lowRisk)) * 100
      ),
    });
  }
  return data;
};

const data = ref(generateDailyData(props.timeRange));

const summary = computed(() => ({
  trendDirection: "up",
  trendPercentage: 12,
}));

const reversedData = computed(() => [...data.value].reverse());

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("ru-RU");

const getTrendBadgeClass = (direction) => {
  if (direction === "up") return "bg-red-100 text-red-800 border-red-200";
  if (direction === "down")
    return "bg-green-100 text-green-800 border-green-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
};

const getTrendLabel = (direction) => {
  if (direction === "up") return "Рост";
  if (direction === "down") return "Снижение";
  return "Стабильно";
};

const getRiskPercentageClass = (percentage) => {
  if (percentage > 70) return "text-red-600";
  if (percentage > 50) return "text-orange-600";
  if (percentage > 30) return "text-yellow-600";
  return "text-green-600";
};

const renderChart = () => {
  if (!chartCanvas.value) return;
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext("2d");

  chartInstance.value = new Chart(ctx, {
    type: chartType.value === "area" ? "line" : chartType.value,
    data: {
      labels: data.value.map((d) => formatDate(d.date)),
      datasets: [
        {
          label: "Высокий риск",
          data: data.value.map((d) => d.highRisk),
          backgroundColor: "rgba(220, 38, 38, 0.5)",
          borderColor: "rgba(220, 38, 38, 1)",
          fill: chartType.value === "area",
        },
        {
          label: "Умеренно высокий",
          data: data.value.map((d) => d.mediumHighRisk),
          backgroundColor: "rgba(234, 88, 12, 0.5)",
          borderColor: "rgba(234, 88, 12, 1)",
          fill: chartType.value === "area",
        },
        {
          label: "Средний риск",
          data: data.value.map((d) => d.mediumRisk),
          backgroundColor: "rgba(202, 138, 4, 0.5)",
          borderColor: "rgba(202, 138, 4, 1)",
          fill: chartType.value === "area",
        },
        {
          label: "Низкий риск",
          data: data.value.map((d) => d.lowRisk),
          backgroundColor: "rgba(22, 163, 74, 0.5)",
          borderColor: "rgba(22, 163, 74, 1)",
          fill: chartType.value === "area",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      scales: { y: { beginAtZero: true } },
    },
  });
};

onMounted(() => {
  renderChart();
});

// при смене типа графика или данных — перерисовываем
watch([chartType, data], () => {
  renderChart();
});

// при возврате на вкладку "график" — перерисовать
watch(viewType, async (val) => {
  if (val === "chart") {
    await nextTick();
    renderChart();
  }
});
</script>

<style scoped>
.card {
  @apply text-card-foreground rounded-lg border shadow-sm;
}
.card-header {
  @apply flex flex-col space-y-1.5 p-6;
}
.card-title {
  @apply text-2xl font-semibold leading-none tracking-tight;
}
.card-content {
  @apply p-6 pt-0;
}
.btn {
  @apply inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors;
}
.btn-outline {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground;
}
.btn-sm {
  @apply h-9 px-3;
}
.select {
  @apply flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm;
}
.badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border;
}
.tab-trigger {
  @apply inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium;
}
.tab-trigger.active {
  @apply bg-background text-foreground shadow-sm;
}
.chart-container {
  @apply relative w-full overflow-hidden rounded-lg;
}
</style>
