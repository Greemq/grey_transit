<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Генератор отчетов</h2>
        <p class="text-muted-foreground">
          Создавайте детальные отчеты по любым параметрам и временным
          промежуткам
        </p>
      </div>

      <div class="flex gap-2">
        <button
          @click="previewOpen = true"
          class="btn btn-outline"
          :disabled="!selectedTemplate"
        >
          <EyeIcon class="w-4 h-4 mr-2" />
          Предпросмотр
        </button>

        <button
          @click="generateReport"
          :disabled="isGenerating || !selectedTemplate"
          class="btn btn-primary min-w-32"
        >
          <div
            v-if="isGenerating"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
          />
          <FileTextIcon v-else class="w-4 h-4 mr-2" />
          {{ isGenerating ? "Генерация..." : "Создать отчет" }}
        </button>
      </div>
    </div>

    <div class="tabs w-full">
      <div class="tabs-list grid w-full grid-cols-4">
        <button
          @click="activeTab = 'templates'"
          :class="['tab-trigger', { active: activeTab === 'templates' }]"
        >
          Шаблоны
        </button>
        <button
          @click="selectedTemplate ? (activeTab = 'filters') : ''"
          :class="['tab-trigger', { active: activeTab === 'filters' }]"
        >
          Параметры
        </button>
        <button
          @click="activeTab = 'format'"
          :class="['tab-trigger', { active: activeTab === 'format' }]"
        >
          Формат
        </button>
        <button
          @click="activeTab = 'history'"
          :class="['tab-trigger', { active: activeTab === 'history' }]"
        >
          История
        </button>
      </div>

      <div class="tab-content mt-4">
        <!-- Templates Tab -->
        <div v-if="activeTab === 'templates'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="template in reportTemplates"
              :key="template.id"
              @click="handleTemplateSelect(template)"
              class="card cursor-pointer transition-colors hover:bg-muted/50"
              :class="{
                'ring-2 ring-primary':
                  selectedTemplate && selectedTemplate.id === template.id,
              }"
            >
              <div class="card-header pb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg">
                    <component :is="template.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="card-title text-base">{{ template.name }}</h3>
                    <span
                      v-if="template.schedule"
                      class="badge badge-secondary text-xs mt-1"
                    >
                      {{ getScheduleLabel(template.schedule) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="card-content">
                <p class="text-sm text-muted-foreground">
                  {{ template.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters Tab -->
        <div v-if="activeTab === 'filters'" class="space-y-6">
          <div v-if="selectedTemplate">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Основные параметры</h3>
              </div>
              <div class="card-content space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="label">Название отчета</label>
                    <input
                      v-model="reportName"
                      class="input"
                      placeholder="Введите название отчета"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="label">Период отчета</label>
                    <select
                      v-model="selectedDatePreset"
                      @change="handleDatePresetSelect"
                      class="select"
                    >
                      <option
                        v-for="preset in datePresets"
                        :key="preset.value"
                        :value="preset.value"
                      >
                        {{ preset.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  v-if="selectedDatePreset === 'custom'"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div class="space-y-2">
                    <label class="label">Дата начала</label>
                    <input v-model="fromDateStr" type="date" class="input" />
                  </div>

                  <div class="space-y-2">
                    <label class="label">Дата окончания</label>
                    <input v-model="toDateStr" type="date" class="input" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="label">Описание отчета</label>
                  <textarea
                    v-model="reportDescription"
                    class="textarea"
                    placeholder="Краткое описание цели и содержания отчета"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
              <!-- Data Filters -->
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title flex items-center gap-2">
                    <FilterIcon class="w-4 h-4" />
                    Фильтры данных
                  </h3>
                </div>
                <div class="card-content space-y-4">
                  <div class="space-y-2">
                    <label class="label">Уровни риска</label>
                    <div class="grid grid-cols-2 gap-2">
                      <div
                        v-for="risk in riskLevels"
                        :key="risk.value"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          :checked="filters.riskLevels.includes(risk.value)"
                          @change="
                            handleRiskLevelChange(
                              risk.value,
                              $event.target.checked
                            )
                          "
                          class="checkbox"
                        />
                        <span :class="`text-sm ${risk.color}`">{{
                          risk.label
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="separator" />

                  <div class="space-y-2">
                    <label class="label">Компании</label>
                    <div class="max-h-40 overflow-y-auto space-y-2">
                      <div
                        v-for="company in availableCompanies"
                        :key="company"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          :checked="filters.companies.includes(company)"
                          @change="
                            handleArrayFilter(
                              'companies',
                              company,
                              $event.target.checked
                            )
                          "
                          class="checkbox"
                        />
                        <span class="text-sm">{{ company }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="separator" />

                  <div class="space-y-2">
                    <label class="label">Регионы</label>
                    <div
                      class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto"
                    >
                      <div
                        v-for="region in availableRegions"
                        :key="region"
                        class="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          :checked="filters.regions.includes(region)"
                          @change="
                            handleArrayFilter(
                              'regions',
                              region,
                              $event.target.checked
                            )
                          "
                          class="checkbox"
                        />
                        <span class="text-sm">{{ region }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Settings -->
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title flex items-center gap-2">
                    <BarChart3Icon class="w-4 h-4" />
                    Содержание отчета
                  </h3>
                </div>
                <div class="card-content space-y-4">
                  <div
                    v-for="option in contentOptions"
                    :key="option.key"
                    class="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      :checked="filters[option.key]"
                      @change="filters[option.key] = $event.target.checked"
                      class="checkbox"
                    />
                    <div class="flex items-center gap-2">
                      <component :is="option.icon" class="w-4 h-4" />
                      <span class="text-sm">{{ option.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Format Tab -->
        <div v-if="activeTab === 'format'" class="space-y-4">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Формат экспорта</h3>
            </div>
            <div class="card-content">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  v-for="format in exportFormats"
                  :key="format.value"
                  @click="exportFormat = format.value"
                  class="card cursor-pointer transition-colors hover:bg-muted/50"
                  :class="{
                    'ring-2 ring-primary': exportFormat === format.value,
                  }"
                >
                  <div class="card-content p-4 text-center">
                    <div class="flex flex-col items-center space-y-2">
                      <div class="p-3 bg-primary/10 rounded-lg">
                        <component :is="format.icon" class="w-6 h-6" />
                      </div>
                      <h4 class="font-medium">{{ format.label }}</h4>
                      <p class="text-xs text-muted-foreground">
                        {{ format.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedTemplate" class="card">
            <div class="card-header">
              <h3 class="card-title">Сводка параметров</h3>
            </div>
            <div class="card-content">
              <div class="space-y-2">
                <div
                  v-for="(item, index) in getFiltersSummary()"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <div class="w-1 h-1 bg-primary rounded-full" />
                  <span class="text-sm">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div v-if="activeTab === 'history'" class="space-y-4">
          <div v-if="generatedReports.length === 0" class="card">
            <div class="card-content p-8 text-center">
              <FileTextIcon
                class="w-12 h-12 mx-auto text-muted-foreground mb-4"
              />
              <h3 class="font-medium mb-2">Нет созданных отчетов</h3>
              <p class="text-muted-foreground mb-4">
                Создайте первый отчет, используя шаблоны или произвольные
                параметры
              </p>
              <button @click="activeTab = 'templates'" class="btn btn-primary">
                Создать отчет
              </button>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="report in generatedReports"
              :key="report.id"
              class="card"
            >
              <div class="card-content p-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h4 class="font-medium">{{ report.name }}</h4>
                      <span class="badge badge-outline">{{
                        report.template
                      }}</span>
                      <span class="badge badge-secondary">{{
                        report.format.toUpperCase()
                      }}</span>
                    </div>

                    <div
                      class="flex items-center gap-4 text-sm text-muted-foreground"
                    >
                      <span>{{ formatDate(report.generatedAt) }}</span>
                      <span v-if="report.size">{{ report.size }}</span>
                    </div>

                    <div v-if="report.status === 'generating'" class="mt-3">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm">Генерация отчета...</span>
                        <span class="text-sm text-muted-foreground"
                          >{{ report.progress }}%</span
                        >
                      </div>
                      <div class="progress">
                        <div
                          class="progress-bar"
                          :style="{ width: `${report.progress}%` }"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      v-if="report.status === 'completed'"
                      @click="downloadReport(report)"
                      class="btn btn-sm"
                    >
                      <DownloadIcon class="w-4 h-4 mr-2" />
                      Скачать
                    </button>

                    <span
                      v-if="report.status === 'failed'"
                      class="badge badge-destructive"
                    >
                      Ошибка
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewOpen" class="modal-overlay" @click="previewOpen = false">
      <div class="modal-content max-w-4xl" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Предпросмотр отчета</h3>
          <p class="modal-description">
            Проверьте настройки перед генерацией отчета
          </p>
          <button @click="previewOpen = false" class="modal-close">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <div v-if="selectedTemplate" class="modal-body space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2">Основная информация</h4>
              <div class="space-y-1 text-sm">
                <div><strong>Название:</strong> {{ reportName }}</div>
                <div><strong>Шаблон:</strong> {{ selectedTemplate.name }}</div>
                <div>
                  <strong>Формат:</strong> {{ exportFormat.toUpperCase() }}
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium mb-2">Параметры</h4>
              <div class="space-y-1 text-sm">
                <div v-for="(item, index) in getFiltersSummary()" :key="index">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-2">Содержание отчета</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="option in getActiveContentOptions()"
                :key="option.key"
                class="badge badge-secondary"
              >
                {{ option.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

// Icons
import FileTextIcon from "./icons/FileTextIcon.vue";
import EyeIcon from "./icons/EyeIcon.vue";
import FilterIcon from "./icons/FilterIcon.vue";
import BarChart3Icon from "./icons/BarChart3Icon.vue";
import DownloadIcon from "./icons/DownloadIcon.vue";
import XIcon from "./icons/XIcon.vue";
import ClockIcon from "./icons/ClockIcon.vue";
import SettingsIcon from "./icons/SettingsIcon.vue";
// import Building2Icon from "./icons/Building2Icon.vue";
import TrendingUpIcon from "./icons/TrendingUpIcon.vue";
import AlertTriangleIcon from "./icons/AlertTriangleIcon.vue";
import DatabaseIcon from "./icons/DatabaseIcon.vue";

// Создаем простые icon компоненты
const FileSpreadsheetIcon = {
  template: '<div class="w-6 h-6 bg-green-500 rounded"></div>',
};
const FileDownIcon = {
  template: '<div class="w-6 h-6 bg-blue-500 rounded"></div>',
};

export default {
  components: {
    FileTextIcon,
    EyeIcon,
    FilterIcon,
    BarChart3Icon,
    DownloadIcon,
    XIcon,
    ClockIcon,
    SettingsIcon,
    // Building2Icon,
    TrendingUpIcon,
    AlertTriangleIcon,
    DatabaseIcon,
    FileSpreadsheetIcon,
    FileDownIcon,
  },
  setup() {
    // Reactive data
    const activeTab = ref("templates");
    const selectedTemplate = ref(null);
    const reportName = ref("");
    const reportDescription = ref("");
    const exportFormat = ref("pdf");
    const isGenerating = ref(false);
    const previewOpen = ref(false);
    const generatedReports = ref([]);
    const selectedDatePreset = ref("today");

    const filters = ref({
      dateRange: { from: new Date(), to: new Date(), preset: "today" },
      companies: [],
      regions: [],
      cargoTypes: [],
      riskLevels: ["high", "medium-high"],
      trainNumbers: [],
      includeMetrics: true,
      includeCharts: true,
      includeTables: false,
      includeAnalytics: false,
      includeCompanies: false,
      includeFinancial: true,
      includePredictions: false,
      customFields: [],
    });

    // Constants
    const reportTemplates = [
      {
        id: "daily-summary",
        name: "Ежедневная сводка",
        description: "Краткий отчет о рисках за день с основными метриками",
        icon: ClockIcon,
        schedule: "daily",
        filters: { ...filters.value },
      },
      {
        id: "weekly-analysis",
        name: "Недельный анализ",
        description: "Подробный анализ рисков и трендов за неделю",
        icon: BarChart3Icon,
        schedule: "weekly",
        filters: { ...filters.value },
      },
      {
        id: "company-report",
        name: "Отчет по компаниям",
        description: "Детальный анализ рисков по каждой компании",
        icon: BarChart3Icon,
        filters: { ...filters.value },
      },
      {
        id: "financial-impact",
        name: "Финансовое воздействие",
        description:
          "Анализ потенциальных убытков и экономической эффективности",
        icon: TrendingUpIcon,
        filters: { ...filters.value },
      },
      {
        id: "custom",
        name: "Произвольный отчет",
        description: "Создайте отчет с любыми параметрами",
        icon: SettingsIcon,
        filters: { ...filters.value },
      },
    ];

    const availableCompanies = [
      "ТОО «КазТрансЛогистик»",
      "АО «Темир Жолы»",
      "ТОО «ЕвразиТранс»",
      "АО «КазахстанТемирЖолы»",
      "ТОО «СтепьКарго»",
      "АО «АлматыЛогистик»",
      "ТОО «КаспийТранс»",
      "АО «СеверТранс»",
      "ТОО «ВостокКарго»",
      "АО «ЮжТрансСервис»",
    ];

    const availableRegions = [
      "Алматы",
      "Астана",
      "Шымкент",
      "Караганда",
      "Атырау",
      "Актау",
      "Петропавловск",
      "Усть-Каменогорск",
      "Тараз",
      "Актобе",
    ];

    const riskLevels = [
      { value: "high", label: "Высокий", color: "text-red-600" },
      {
        value: "medium-high",
        label: "Умеренно высокий",
        color: "text-orange-600",
      },
      { value: "medium", label: "Средний", color: "text-yellow-600" },
      { value: "low", label: "Низкий", color: "text-green-600" },
    ];

    const contentOptions = [
      {
        key: "includeMetrics",
        label: "Основные метрики",
        icon: AlertTriangleIcon,
      },
      {
        key: "includeCharts",
        label: "Графики и диаграммы",
        icon: BarChart3Icon,
      },
      { key: "includeTables", label: "Детальные таблицы", icon: DatabaseIcon },
      {
        key: "includeAnalytics",
        label: "Аналитические выводы",
        icon: TrendingUpIcon,
      },
      {
        key: "includeCompanies",
        label: "Анализ по компаниям",
        icon: TrendingUpIcon,
      },
      {
        key: "includeFinancial",
        label: "Финансовый анализ",
        icon: TrendingUpIcon,
      },
      { key: "includePredictions", label: "Прогнозы", icon: EyeIcon },
    ];

    const exportFormats = [
      {
        value: "pdf",
        label: "PDF документ",
        description: "Готовый к печати отчет",
        icon: FileTextIcon,
      },
      {
        value: "excel",
        label: "Excel таблица",
        description: "Для дальнейшего анализа",
        icon: FileSpreadsheetIcon,
      },
      {
        value: "csv",
        label: "CSV файл",
        description: "Универсальный формат данных",
        icon: DatabaseIcon,
      },
      {
        value: "json",
        label: "JSON данные",
        description: "Для интеграции с системами",
        icon: FileDownIcon,
      },
    ];

    const datePresets = [
      { value: "today", label: "Сегодня" },
      { value: "yesterday", label: "Вчера" },
      { value: "week", label: "Эта неделя" },
      { value: "month", label: "Этот месяц" },
      { value: "quarter", label: "Этот квартал" },
      { value: "year", label: "Этот год" },
      { value: "custom", label: "Произвольный период" },
    ];

    // Computed
    const fromDateStr = computed({
      get: () => filters.value.dateRange.from.toISOString().split("T")[0],
      set: (value) => {
        filters.value.dateRange.from = new Date(value);
      },
    });

    const toDateStr = computed({
      get: () => filters.value.dateRange.to.toISOString().split("T")[0],
      set: (value) => {
        filters.value.dateRange.to = new Date(value);
      },
    });

    // Methods
    const handleTemplateSelect = (template) => {
      selectedTemplate.value = template;
      filters.value = { ...template.filters };
      reportName.value = template.name;
      reportDescription.value = template.description;
      activeTab.value = "filters";
    };

    const handleDatePresetSelect = () => {
      const today = new Date();
      switch (selectedDatePreset.value) {
        case "today":
          filters.value.dateRange = { from: today, to: today, preset: "today" };
          break;
        case "yesterday":
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          filters.value.dateRange = {
            from: yesterday,
            to: yesterday,
            preset: "yesterday",
          };
          break;
        default:
          filters.value.dateRange.preset = selectedDatePreset.value;
      }
    };

    const handleArrayFilter = (key, value, checked) => {
      const currentArray = filters.value[key];
      if (checked) {
        if (!currentArray.includes(value)) {
          currentArray.push(value);
        }
      } else {
        const index = currentArray.indexOf(value);
        if (index > -1) {
          currentArray.splice(index, 1);
        }
      }
    };

    const handleRiskLevelChange = (value, checked) => {
      handleArrayFilter("riskLevels", value, checked);
    };

    const getScheduleLabel = (schedule) => {
      const labels = {
        daily: "Ежедневно",
        weekly: "Еженедельно",
        monthly: "Ежемесячно",
      };
      return labels[schedule] || schedule;
    };

    const getFiltersSummary = () => {
      const items = [];

      if (
        filters.value.dateRange.preset &&
        filters.value.dateRange.preset !== "custom"
      ) {
        const preset = datePresets.find(
          (p) => p.value === filters.value.dateRange.preset
        );
        items.push(`Период: ${preset?.label}`);
      } else {
        items.push(
          `Период: ${formatDate(filters.value.dateRange.from)} - ${formatDate(
            filters.value.dateRange.to
          )}`
        );
      }

      if (filters.value.companies.length > 0) {
        items.push(`Компании: ${filters.value.companies.length} выбрано`);
      }

      if (filters.value.regions.length > 0) {
        items.push(`Регионы: ${filters.value.regions.length} выбрано`);
      }

      if (filters.value.riskLevels.length > 0) {
        items.push(`Уровни риска: ${filters.value.riskLevels.length} выбрано`);
      }

      return items;
    };

    const getActiveContentOptions = () => {
      return contentOptions.filter((option) => filters.value[option.key]);
    };

    const formatDate = (date) => {
      return date.toLocaleDateString("ru-RU");
    };

    const generateReport = async () => {
      if (!reportName.value.trim()) {
        alert("Введите название отчета");
        return;
      }

      isGenerating.value = true;

      const newReport = {
        id: `report_${Date.now()}`,
        name: reportName.value,
        template: selectedTemplate.value?.name || "Произвольный",
        filters: { ...filters.value },
        generatedAt: new Date(),
        status: "generating",
        progress: 0,
        size: "",
        format: exportFormat.value,
      };

      generatedReports.value.unshift(newReport);

      // Симуляция генерации отчета
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const reportIndex = generatedReports.value.findIndex(
          (r) => r.id === newReport.id
        );
        if (reportIndex !== -1) {
          generatedReports.value[reportIndex].progress = progress;
        }
      }

      // Завершение генерации
      const reportIndex = generatedReports.value.findIndex(
        (r) => r.id === newReport.id
      );
      if (reportIndex !== -1) {
        generatedReports.value[reportIndex] = {
          ...generatedReports.value[reportIndex],
          status: "completed",
          progress: 100,
          size: `${(Math.random() * 5 + 1).toFixed(1)} МБ`,
          downloadUrl: `/reports/${newReport.id}.${exportFormat.value}`,
        };
      }

      isGenerating.value = false;
      activeTab.value = "history";
    };

    const downloadReport = (report) => {
      alert(`Отчет "${report.name}" скачивается...`);
    };

    return {
      activeTab,
      selectedTemplate,
      reportName,
      reportDescription,
      exportFormat,
      isGenerating,
      previewOpen,
      generatedReports,
      selectedDatePreset,
      filters,
      reportTemplates,
      availableCompanies,
      availableRegions,
      riskLevels,
      contentOptions,
      exportFormats,
      datePresets,
      fromDateStr,
      toDateStr,
      handleTemplateSelect,
      handleDatePresetSelect,
      handleArrayFilter,
      handleRiskLevelChange,
      getScheduleLabel,
      getFiltersSummary,
      getActiveContentOptions,
      formatDate,
      generateReport,
      downloadReport,
    };
  },
};
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

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2;
}

.btn-outline {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2;
}

.btn-sm {
  @apply h-9 px-3;
}

.input {
  @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.textarea {
  @apply flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.select {
  @apply flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

.checkbox {
  @apply h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2;
}

.label {
  @apply text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70;
}

.badge {
  @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors;
}

.badge-outline {
  @apply border border-transparent;
}

.badge-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
}

.badge-destructive {
  @apply bg-destructive text-destructive-foreground hover:bg-destructive/80;
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

.separator {
  @apply h-px bg-border;
}

.progress {
  @apply relative h-4 w-full overflow-hidden rounded-full bg-secondary;
}

.progress-bar {
  @apply h-full w-full flex-1 bg-primary transition-all;
}

.modal-overlay {
  @apply fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-content {
  @apply relative bg-background border rounded-lg shadow-lg max-h-[85vh] overflow-y-auto;
}

.modal-header {
  @apply flex flex-col space-y-1.5 p-6 relative;
}

.modal-title {
  @apply text-lg font-semibold leading-none tracking-tight;
}

.modal-description {
  @apply text-sm text-muted-foreground;
}

.modal-close {
  @apply absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2;
}

.modal-body {
  @apply p-6 pt-0;
}
</style>
