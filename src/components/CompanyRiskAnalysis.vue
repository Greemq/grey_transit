<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Анализ компаний в сером транзите</h2>
        <p class="text-muted-foreground">
          Статистика по компаниям с высокой и умеренно высокой вероятностью
          теневого транзита
        </p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm">
          <DownloadIcon class="w-4 h-4 mr-2" />
          Экспорт
        </button>
        <button class="btn btn-outline btn-sm">
          <FilterIcon class="w-4 h-4 mr-2" />
          Фильтры
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Компаний в риске</p>
            <!-- <p class="text-2xl font-semibold">{{ filteredCompanies.length }}</p> -->
            <p class="text-2xl font-semibold">23</p>
          </div>
          <div class="w-8 h-8 text-blue-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Всего случаев риска</p>
            <p class="text-2xl font-semibold">
              <!-- {{ totalRiskCases.toLocaleString() }} -->
              729
            </p>
          </div>
          <AlertTriangleIcon class="w-8 h-8 text-red-500" />
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Потенциальный ущерб</p>
            <p class="text-2xl font-semibold">
              <!-- {{ formatCurrency(totalPotentialLoss) }} -->
              758 100 000 ₸
            </p>
          </div>
          <TrendingUpIcon class="w-8 h-8 text-orange-500" />
        </div>
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Средний % риска</p>
            <p class="text-2xl font-semibold">{{ averageRisk.toFixed(1) }}%</p>
          </div>
          <TrendingDownIcon class="w-8 h-8 text-green-500" />
        </div>
      </div>
    </div>

    <div class="tabs w-full">
      <div class="tabs-list grid !grid-cols-2 mb-6">
        <button
          @click="activeTab = 'companies'"
          :class="['tab-trigger', { active: activeTab === 'companies' }]"
        >
          Компании
        </button>
        <!-- <button
          @click="activeTab = 'analytics'"
          :class="['tab-trigger', { active: activeTab === 'analytics' }]"
        >
          Аналитика
        </button> -->
        <button
          @click="activeTab = 'regions'"
          :class="['tab-trigger', { active: activeTab === 'regions' }]"
        >
          Регионы
        </button>
      </div>

      <div class="tab-content">
        <!-- Companies Tab -->
        <div v-if="activeTab === 'companies'" class="space-y-4">
          <!-- Filters -->
          <div
            class="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg"
          >
            <div class="flex-1 relative">
              <SearchIcon
                class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
              />
              <input
                v-model="searchTerm"
                placeholder="Поиск по названию компании..."
                class="input w-full pl-10"
              />
            </div>

            <select v-model="filterRegion" class="select w-48">
              <option value="all">Все регионы</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>

            <select v-model="filterRisk" class="select w-48">
              <option value="all">Все уровни</option>
              <option value="critical">Критический</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>

            <select v-model="sortBy" class="select w-48">
              <option value="risk">По риску</option>
              <option value="cases">По случаям</option>
              <option value="loss">По потерям</option>
              <option value="name">По названию</option>
            </select>
          </div>

          <!-- Companies List -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Рейтинг компаний по уровню риска</h3>
            </div>
            <div class="card-content">
              <div class="space-y-4">
                <div
                  v-for="(company, index) in filteredCompanies"
                  :key="company.id"
                  class="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold"
                  >
                    {{ index + 1 }}
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center space-x-2">
                        <h4 class="font-medium truncate">{{ company.name }}</h4>
                        <span
                          class="badge badge-outline"
                          :class="getRiskCategoryColor(company.riskCategory)"
                        >
                          {{ getRiskCategoryLabel(company.riskCategory) }}
                        </span>
                      </div>
                      <div class="text-right">
                        <div class="text-lg font-semibold text-red-600">
                          {{ company.highRiskCases + company.mediumRiskCases }}
                          случаев
                        </div>
                        <div class="text-sm text-muted-foreground">
                          {{ company.riskPercentage }}% от всех случаев
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p class="text-muted-foreground">Регион</p>
                        <p class="font-medium flex items-center">
                          <GlobeIcon class="w-3 h-3 mr-1" />
                          {{ company.region }}
                        </p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Высокий риск</p>
                        <p class="font-medium text-red-600">
                          {{ company.highRiskCases }}
                        </p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Умеренный риск</p>
                        <p class="font-medium text-orange-600">
                          {{ company.mediumRiskCases }}
                        </p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Потенциальный ущерб</p>
                        <p class="font-medium">
                          {{ formatCurrency(company.potentialLoss) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-muted-foreground">Основной груз</p>
                        <p class="font-medium">{{ company.mainCargo }}</p>
                      </div>
                    </div>

                    <div class="mt-2 flex items-center justify-between">
                      <div class="text-sm text-muted-foreground">
                        Последний инцидент:
                        {{ formatDate(company.lastIncident) }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <TrendingUpIcon
                          v-if="company.trend > 0"
                          class="w-4 h-4 text-red-500"
                        />
                        <TrendingDownIcon
                          v-else
                          class="w-4 h-4 text-green-500"
                        />
                        <span
                          class="text-sm font-medium"
                          :class="
                            company.trend > 0
                              ? 'text-red-500'
                              : 'text-green-500'
                          "
                        >
                          {{ company.trend > 0 ? "+" : ""
                          }}{{ company.trend.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Топ-10 компаний по количеству рисков</h3>
              </div>
              <div class="card-content">
                <div class="chart-container h-[400px]">
                  <canvas ref="topCompaniesChart"></canvas>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">
                  Распределение компаний по уровню риска
                </h3>
              </div>
              <div class="card-content">
                <div class="chart-container h-[400px]">
                  <canvas ref="riskCategoriesChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Regions Tab -->
        <div v-if="activeTab === 'regions'" class="space-y-4">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Анализ по регионам</h3>
            </div>
            <div class="card-content">
              <div class="space-y-4">
                <div
                  v-for="(region, index) in regionsData"
                  :key="region.region"
                  class="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-semibold"
                    >
                      {{ index + 1 }}
                    </div>
                    <div>
                      <h4 class="font-medium">{{ region.region }}</h4>
                      <p class="text-sm text-muted-foreground">
                        {{ region.companies }} компаний в риске
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-semibold">
                      {{ region.cases }} случаев
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ ((region.cases / totalRiskCases) * 100).toFixed(1) }}%
                      от общего
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import AlertTriangleIcon from "./icons/AlertTriangleIcon.vue";
import TrendingUpIcon from "./icons/TrendingUpIcon.vue";
import TrendingDownIcon from "./icons/TrendingDownIcon.vue";
import SearchIcon from "./icons/SearchIcon.vue";
import DownloadIcon from "./icons/DownloadIcon.vue";
import FilterIcon from "./icons/FilterIcon.vue";
import GlobeIcon from "./icons/GlobeIcon.vue";

const props = defineProps({
  timeRange: String,
});

// Reactive state
const activeTab = ref("companies");
const searchTerm = ref("");
const filterRegion = ref("all");
const filterRisk = ref("all");
const sortBy = ref("risk");

// Generate company data
const companies = ref([]);

const generateCompanyData = (timeRange) => {
  const companiesData = [
    {
      name: "ТОО «КазТрансЛогистик»",
      region: "Алматы",
      mainCargo: "Контейнеры",
    },
    { name: "АО «Темир Жолы»", region: "Астана", mainCargo: "Зерно" },
    { name: "ТОО «ЕвразиТранс»", region: "Шымкент", mainCargo: "Металл" },
    {
      name: "АО «КазахстанТемирЖолы»",
      region: "Караганда",
      mainCargo: "Уголь",
    },
    { name: "ТОО «СтепьКарго»", region: "Атырау", mainCargo: "Нефтепродукты" },
    {
      name: "АО «АлматыЛогистик»",
      region: "Алматы",
      mainCargo: "Продукты питания",
    },
    { name: "ТОО «КаспийТранс»", region: "Актау", mainCargo: "Химикаты" },
    {
      name: "АО «СеверТранс»",
      region: "Петропавловск",
      mainCargo: "Сельхозпродукция",
    },
    {
      name: "ТОО «ВостокКарго»",
      region: "Усть-Каменогорск",
      mainCargo: "Руда",
    },
    {
      name: "АО «ЮжТрансСервис»",
      region: "Тараз",
      mainCargo: "Стройматериалы",
    },
    { name: "ТОО «АктобеЛогистик»", region: "Актобе", mainCargo: "Промтовары" },
    {
      name: "АО «МангистауКарго»",
      region: "Актау",
      mainCargo: "Газ сжиженный",
    },
  ];

  const periodMultipliers = {
    day: 1 / 30,
    week: 7 / 30,
    month: 1,
    quarter: 3,
    "half-year": 6,
    year: 12,
  };

  const multiplier = periodMultipliers[timeRange] || 1;

  return companiesData
    .map((company, index) => {
      const baseHighRisk = Math.floor((50 + Math.random() * 100) * multiplier);
      const baseMediumRisk = Math.floor((30 + Math.random() * 80) * multiplier);
      const safeCases = baseHighRisk + baseMediumRisk;
      const totalCases =
        safeCases + Math.floor(Math.random() * 20 * multiplier);
      const riskPercentage =
        totalCases > 0 ? (safeCases / totalCases) * 100 : 0;
      const potentialLoss = safeCases * 700000;

      let riskCategory;
      if (riskPercentage > 80) riskCategory = "critical";
      else if (riskPercentage > 60) riskCategory = "high";
      else if (riskPercentage > 40) riskCategory = "medium";
      else riskCategory = "low";

      return {
        id: `company_${index + 1}`,
        name: company.name,
        region: company.region,
        highRiskCases: baseHighRisk,
        mediumRiskCases: baseMediumRisk,
        totalCases,
        riskPercentage: Math.round(riskPercentage),
        potentialLoss,
        averageLossPerCase:
          safeCases > 0 ? Math.round(potentialLoss / safeCases) : 0,
        trend: (Math.random() - 0.5) * 20,
        lastIncident: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        mainCargo: company.mainCargo,
        riskCategory,
      };
    })
    .sort(
      (a, b) =>
        b.highRiskCases +
        b.mediumRiskCases -
        (a.highRiskCases + a.mediumRiskCases)
    );
};

// Computed properties
const filteredCompanies = computed(() => {
  return companies.value
    .filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
        (filterRegion.value === "all" ||
          company.region === filterRegion.value) &&
        (filterRisk.value === "all" ||
          company.riskCategory === filterRisk.value)
    )
    .sort((a, b) => {
      switch (sortBy.value) {
        case "risk":
          return (
            b.highRiskCases +
            b.mediumRiskCases -
            (a.highRiskCases + a.mediumRiskCases)
          );
        case "cases":
          return b.totalCases - a.totalCases;
        case "loss":
          return b.potentialLoss - a.potentialLoss;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
});

const regions = computed(() => [
  ...new Set(companies.value.map((c) => c.region)),
]);

const totalRiskCases = computed(() =>
  filteredCompanies.value.reduce(
    (sum, company) => sum + company.highRiskCases + company.mediumRiskCases,
    0
  )
);

const totalPotentialLoss = computed(() =>
  filteredCompanies.value.reduce(
    (sum, company) => sum + company.potentialLoss,
    0
  )
);

const averageRisk = computed(() => {
  if (filteredCompanies.value.length === 0) return 0;
  return (
    filteredCompanies.value.reduce(
      (sum, company) => sum + company.riskPercentage,
      0
    ) / filteredCompanies.value.length
  );
});

const regionsData = computed(() =>
  Object.entries(
    filteredCompanies.value.reduce((acc, company) => {
      acc[company.region] =
        (acc[company.region] || 0) +
        (company.highRiskCases + company.mediumRiskCases);
      return acc;
    }, {})
  )
    .map(([region, cases]) => ({
      region,
      cases,
      companies: filteredCompanies.value.filter((c) => c.region === region)
        .length,
    }))
    .sort((a, b) => b.cases - a.cases)
);

// Methods
const formatCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} млрд ₸`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} млн ₸`;
  } else {
    return `${amount.toLocaleString()} ₸`;
  }
};

const getRiskCategoryColor = (category) => {
  const colors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[category];
};

const getRiskCategoryLabel = (category) => {
  const labels = {
    critical: "Критический",
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
  };
  return labels[category];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ru-RU");
};

// Lifecycle
onMounted(() => {
  companies.value = generateCompanyData(props.timeRange);
});

watch(
  () => props.timeRange,
  (newTimeRange) => {
    companies.value = generateCompanyData(newTimeRange);
  }
);
</script>
<style scoped>
.card {
  @apply bg-card text-card-foreground rounded-lg border shadow-sm;
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
  @apply inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
}

.btn-outline {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground;
}

.btn-sm {
  @apply h-9 px-3;
}

.input {
  @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.select {
  @apply flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors;
}

.badge-outline {
  @apply border border-transparent;
}

.tabs-list {
  @apply inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground;
}

.tab-trigger {
  @apply inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
}

.tab-trigger.active {
  @apply bg-background text-foreground shadow-sm;
}

.chart-container {
  @apply relative w-full overflow-hidden rounded-lg;
}
</style>
