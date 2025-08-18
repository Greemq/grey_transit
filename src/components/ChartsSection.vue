<template>
  <div class="space-y-6">
    <RiskDynamics :time-range="timeRange" />

    <div class="tabs w-full">
      <div class="tabs-list grid w-full !grid-cols-3 mb-6">
        <button
          v-if="false"
          @click="activeTab = 'trends'"
          :class="['tab-trigger', { active: activeTab === 'trends' }]"
        >
          <ActivityIcon class="w-4 h-4" /> Тренды
        </button>
        <button
          @click="activeTab = 'distribution'"
          :class="['tab-trigger', { active: activeTab === 'distribution' }]"
        >
          <PieChartIcon /> Распределение
        </button>
        <button
          @click="activeTab = 'regions'"
          :class="['tab-trigger', { active: activeTab === 'regions' }]"
        >
          <BarChart3Icon class="w-4 h-4" /> Регионы
        </button>
        <button
          @click="activeTab = 'cargo'"
          :class="['tab-trigger', { active: activeTab === 'cargo' }]"
        >
          <TrendingUpIcon class="w-4 h-4" /> Грузы
        </button>
      </div>

      <div class="tab-content">
        <div
          v-show="activeTab === 'trends'"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Динамика рисков по времени</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap"><canvas ref="trendsChart"></canvas></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Сравнение типов рисков</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap">
                <canvas ref="comparisonChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div
          v-show="activeTab === 'distribution'"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Распределение рисков по уровням</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap">
                <canvas ref="distributionChart"></canvas>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Эффективность обнаружения</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap">
                <canvas ref="efficiencyChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div
          v-show="activeTab === 'regions'"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Распределение по регионам</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap"><canvas ref="regionsChart"></canvas></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Региональная статистика</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap">
                <canvas ref="regionalStatsChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'cargo'">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Анализ рисков по типам грузов</h3>
            </div>
            <div class="card-content">
              <div class="chart-wrap"><canvas ref="cargoChart"></canvas></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watch,
  nextTick,
  onBeforeUnmount,
  computed,
} from "vue";
import Chart from "chart.js/auto";
import RiskDynamics from "./RiskDynamics.vue";
import ActivityIcon from "./icons/ActivityIcon.vue";
import BarChart3Icon from "./icons/BarChart3Icon.vue";
import TrendingUpIcon from "./icons/TrendingUpIcon.vue";

const PieChartIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="m22 12-10-10v10z"/></svg>`,
};

const props = defineProps({
  timeRange: { type: String, required: true },
});

const activeTab = ref("distribution");

const trendsChart = ref(null);
const comparisonChart = ref(null);
const distributionChart = ref(null);
const efficiencyChart = ref(null);
const regionsChart = ref(null);
const regionalStatsChart = ref(null);
const cargoChart = ref(null);

const charts = {};
const lineBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  plugins: { legend: { position: "top" } },
};
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { position: "top" } },
};

const periods = computed(() =>
  props.timeRange === "day"
    ? 24
    : props.timeRange === "week"
    ? 7
    : props.timeRange === "month"
    ? 30
    : 12
);
const labels = computed(() =>
  Array.from({ length: periods.value }, (_, i) =>
    props.timeRange === "day"
      ? `${i}:00`
      : props.timeRange === "week"
      ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]
      : props.timeRange === "month"
      ? `${i + 1}`
      : `Мес ${i + 1}`
  )
);

function genSeries(n, max) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * max));
}
function getLineBarData() {
  return {
    labels: labels.value,
    datasets: [
      {
        label: "Высокий риск",
        data: genSeries(periods.value, 50),
        borderColor: "rgb(239,68,68)",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.3,
      },
      {
        label: "Средний риск",
        data: genSeries(periods.value, 30),
        borderColor: "rgb(249,115,22)",
        backgroundColor: "rgba(249,115,22,0.2)",
        tension: 0.3,
      },
      {
        label: "Низкий риск",
        data: genSeries(periods.value, 20),
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
    ],
  };
}
function getPieData() {
  const hi = Math.floor(Math.random() * 50) + 20;
  const mid = Math.floor(Math.random() * 40) + 10;
  const lo = Math.floor(Math.random() * 30) + 5;
  return {
    labels: ["Высокий риск", "Средний риск", "Низкий риск"],
    datasets: [
      {
        data: [hi, mid, lo],
        backgroundColor: [
          "rgb(239,68,68)",
          "rgb(249,115,22)",
          "rgb(34,197,94)",
        ],
      },
    ],
  };
}
function getDoughnutData() {
  const detected = Math.floor(Math.random() * 30) + 60;
  return {
    labels: ["Обнаружено", "Пропущено"],
    datasets: [
      {
        data: [detected, 100 - detected],
        backgroundColor: ["rgb(59,130,246)", "rgb(156,163,175)"],
      },
    ],
  };
}
function getRegionsBarData() {
  return {
    labels: ["Москва", "СПб", "Казань", "Новосибирск", "Екатеринбург"],
    datasets: [
      {
        label: "Риски",
        data: genSeries(5, 25),
        backgroundColor: "rgba(20,184,166,0.4)",
        borderColor: "rgb(20,184,166)",
      },
    ],
  };
}
function getRegionsLineData() {
  return {
    labels: ["Москва", "СПб", "Казань", "Новосибирск", "Екатеринбург"],
    datasets: [
      {
        label: "Динамика",
        data: genSeries(5, 12),
        borderColor: "rgb(168,85,247)",
        backgroundColor: "rgba(168,85,247,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };
}
function getCargoBarData() {
  return {
    labels: ["Продукты", "Техника", "Одежда", "Химия", "Дерево"],
    datasets: [
      {
        label: "Риски",
        data: genSeries(5, 30),
        backgroundColor: [
          "rgb(239,68,68)",
          "rgb(249,115,22)",
          "rgb(34,197,94)",
          "rgb(59,130,246)",
          "rgb(234,179,8)",
        ],
      },
    ],
  };
}

function destroyChart(key) {
  if (charts[key]) {
    charts[key].destroy();
    charts[key] = null;
  }
}
function createChart(key, refEl, type, data, options) {
  if (!refEl?.value) return;
  destroyChart(key);
  const ctx = refEl.value.getContext("2d");
  if (!ctx) return;
  charts[key] = new Chart(ctx, { type, data, options });
}

async function renderActiveTabCharts() {
  await nextTick();
  if (activeTab.value === "trends") {
    createChart(
      "trendsLine",
      trendsChart,
      "line",
      getLineBarData(),
      lineBarOptions
    );
    createChart(
      "trendsCompare",
      comparisonChart,
      "bar",
      getLineBarData(),
      lineBarOptions
    );
  } else if (activeTab.value === "distribution") {
    createChart("distPie", distributionChart, "pie", getPieData(), pieOptions);
    createChart(
      "effDonut",
      efficiencyChart,
      "doughnut",
      getDoughnutData(),
      pieOptions
    );
  } else if (activeTab.value === "regions") {
    createChart(
      "regionsBar",
      regionsChart,
      "bar",
      getRegionsBarData(),
      lineBarOptions
    );
    createChart(
      "regionsLine",
      regionalStatsChart,
      "line",
      getRegionsLineData(),
      lineBarOptions
    );
  } else if (activeTab.value === "cargo") {
    createChart(
      "cargoBar",
      cargoChart,
      "bar",
      getCargoBarData(),
      lineBarOptions
    );
  }
}

onMounted(renderActiveTabCharts);

watch(activeTab, async () => {
  await renderActiveTabCharts();
});

watch(
  () => props.timeRange,
  async () => {
    await renderActiveTabCharts();
  }
);

onBeforeUnmount(() => {
  Object.keys(charts).forEach(destroyChart);
});
</script>

<style scoped>
.card {
  @apply bg-card text-card-foreground rounded-lg border shadow-sm;
}
.card-header {
  @apply p-4 font-semibold;
}
.card-title {
  @apply text-lg;
}
.card-content {
  @apply p-4;
}
.tabs-list {
  @apply grid grid-cols-4 gap-2 p-0;
}
.tab-trigger {
  @apply p-2  rounded text-sm flex items-center gap-2 justify-center;
}
.tab-trigger.active {
  @apply bg-blue-500 text-white;
}
.chart-wrap {
  @apply h-80 w-full;
}
.chart-wrap canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
