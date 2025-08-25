<script setup>
import ChartsSection from "@/components/ChartsSection.vue";
import FinancialAnalysis from "@/components/FinancialAnalysis.vue";
import PredictiveAnalytics from "@/components/PredictiveAnalytics.vue";
import AnalyticsInsights from "@/components/AnalyticsInsights.vue";
import DataTable from "@/components/DataTable.vue";
import { ref } from "vue";
import CompanyRiskAnalysis from "@/components/CompanyRiskAnalysis.vue";
import ReportGenerator from "@/components/ReportGenerator.vue";
import TimeRangeSelector from "@/components/TimeRangeSelector.vue";

const activeTab = ref(1);
</script>

<template>
  <div class="main">
    <div class="card !p-4">
      <TimeRangeSelector />
    </div>
    <div class="card card_2">
      <div class="item">
        <div class="item__header">
          <h4>Высокая вероятность теневого транзита</h4>
          <div class="p-2 rounded-lg bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-triangle-alert w-4 h-4"
              aria-hidden="true"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
              ></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </div>
        </div>
        <div class="item__description">
          <div class="font-bold">729</div>
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trending-up w-4 h-4 text-red-500"
              aria-hidden="true"
            >
              <path d="M16 7h6v6"></path>
              <path d="m22 7-8.5 8.5-5-5L2 17"></path></svg
            ><span class="text-xs text-red-600">+4.8% за период</span>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="item__header">
          <h4>Умеренно высокая вероятность</h4>
          <div class="p-2 rounded-lg bg-orange-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-triangle-alert w-4 h-4"
              aria-hidden="true"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
              ></path>
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
            </svg>
          </div>
        </div>
        <div class="item__description">
          <div class="font-bold">354</div>
          <div class="flex items-center gap-2 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trending-up w-4 h-4 text-red-500"
              aria-hidden="true"
            >
              <path d="M16 7h6v6"></path>
              <path d="m22 7-8.5 8.5-5-5L2 17"></path></svg
            ><span class="text-xs text-red-600">+4.8% за период</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item__header">
          <h4>Вагоны под серым транзитом</h4>
          <div class="p-2 rounded-lg bg-blue-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-tram-front w-4 h-4"
              aria-hidden="true"
            >
              <rect width="16" height="16" x="4" y="3" rx="2"></rect>
              <path d="M4 11h16"></path>
              <path d="M12 3v8"></path>
              <path d="m8 19-2 3"></path>
              <path d="m18 22-2-3"></path>
              <path d="M8 15h.01"></path>
              <path d="M16 15h.01"></path>
            </svg>
          </div>
        </div>
        <div class="item__description">
          <div class="font-bold">101</div>
          <div class="flex items-center gap-2 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trending-up w-4 h-4 text-red-500"
              aria-hidden="true"
            >
              <path d="M16 7h6v6"></path>
              <path d="m22 7-8.5 8.5-5-5L2 17"></path></svg
            ><span class="text-xs text-red-600">+4.8% за период</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item__header">
          <h4>Потенциальный ущерб</h4>
          <div class="p-2 rounded-lg bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-dollar-sign w-4 h-4"
              aria-hidden="true"
            >
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path
                d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
              ></path>
            </svg>
          </div>
        </div>
        <div class="item__description">
          <div class="font-bold">758 100 000 ₸</div>
          <div class="flex items-center gap-2 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trending-up w-4 h-4 text-red-500"
              aria-hidden="true"
            >
              <path d="M16 7h6v6"></path>
              <path d="m22 7-8.5 8.5-5-5L2 17"></path></svg
            ><span class="text-xs text-red-600">+4.8% за период</span>
          </div>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="tabs">
        <div
          class="tab"
          :class="{ active: activeTab == 1 }"
          @click="activeTab = 1"
        >
          Обзор
        </div>
        <div
          class="tab"
          :class="{ active: activeTab == 2 }"
          @click="activeTab = 2"
        >
          Компании
        </div>
        <div
          class="tab"
          :class="{ active: activeTab == 7 }"
          @click="activeTab = 7"
        >
          Отчеты
        </div>
        <div
          class="tab"
          :class="{ active: activeTab == 3 }"
          @click="activeTab = 3"
        >
          Финансы
        </div>
        <div
          class="tab"
          :class="{ active: activeTab == 4 }"
          @click="activeTab = 4"
        >
          Прогнозы
        </div>
        <div
          class="tab"
          :class="{ active: activeTab == 5 }"
          @click="activeTab = 5"
        >
          Аналитика
        </div>
        <div
          class="tab"
          :class="{ active: activeTab == 6 }"
          @click="activeTab = 6"
        >
          Данные
        </div>
      </div>
    </div>
    <ChartsSection v-if="activeTab == 1" />
    <CompanyRiskAnalysis v-else-if="activeTab == 2" />
    <FinancialAnalysis v-else-if="activeTab == 3" :time-range="timeRange" />
    <PredictiveAnalytics v-else-if="activeTab == 4" :time-range="timeRange" />
    <ReportGenerator v-else-if="activeTab == 7" />

    <AnalyticsInsights v-else-if="activeTab == 5" class="animate-fade-in" />
    <DataTable v-else-if="activeTab == 6" class="animate-fade-in px-0" />
  </div>
</template>
