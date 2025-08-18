<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h3 class="card-title">Детализация по операциям</h3>
        <div class="flex items-center gap-2">
          <div class="relative">
            <SearchIcon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              type="text"
              placeholder="Поиск по документам, отправителям..."
              v-model="searchTerm"
              class="input pl-10 w-80"
            />
          </div>
          <button class="btn btn-outline btn-sm">
            <FilterIcon class="w-4 h-4 mr-2" />
            Фильтр
          </button>
          <button class="btn btn-outline btn-sm">
            <DownloadIcon class="w-4 h-4 mr-2" />
            Excel
          </button>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>
                <button @click="handleSort('id')" class="sort-button">
                  Документ №
                  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
                </button>
              </th>
              <th>
                <button @click="handleSort('sender')" class="sort-button">
                  Наименование ГТД
                  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
                </button>
              </th>
              <th>
                <button @click="handleSort('receiver')" class="sort-button">
                  Наименование ГТТ
                  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
                </button>
              </th>
              <th>
                <button @click="handleSort('country')" class="sort-button">
                  Страна
                  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
                </button>
              </th>
              <th>
                <button @click="handleSort('riskLevel')" class="sort-button">
                  Уровень риска
                  <ArrowUpDownIcon class="ml-2 h-4 w-4" />
                </button>
              </th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in filteredData"
              :key="record.id"
              class="table-row hover:bg-muted/50"
            >
              <td class="font-mono text-sm">{{ record.id }}</td>
              <td class="max-w-xs truncate" :title="record.document">
                {{ record.document }}
              </td>
              <td class="max-w-xs truncate" :title="record.sender">
                {{ record.sender }}
              </td>
              <td>{{ record.country }}</td>
              <td>
                <RiskBadge
                  :riskLevel="record.riskLevel"
                  :probability="record.probability"
                />
              </td>
              <td class="text-muted-foreground">{{ record.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SearchIcon from "./icons/SearchIcon.vue";
import FilterIcon from "./icons/FilterIcon.vue";
import DownloadIcon from "./icons/DownloadIcon.vue";
import ArrowUpDownIcon from "./icons/ArrowUpDownIcon.vue";
import RiskBadge from "./RiskBadge.vue";

const searchTerm = ref("");
const sortField = ref(null);
const sortDirection = ref("asc");

const mockData = [
  {
    id: "13046674",
    document: "ДАИТОН ЗАВОД ПРИВОДНЫХ ЦЕПЕЙ АО",
    sender: "ТОО GAZEXPORTCENTRE - PIPE",
    receiver: "Латвия",
    country: "Россия",
    riskLevel: "high",
    probability: 94,
    date: "13.08.2025",
  },
  {
    id: "36771134",
    document: "АКЦИОНЕРНОЕ ОБЩЕСТВО КОМПАНИЯ АЛГОРИТМИКА",
    sender: "ТОО GAZEXPORTCENTRE - PIPE",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "medium-high",
    probability: 78,
    date: "13.08.2025",
  },
  {
    id: "36832055",
    document: "ТОО СЕВЕРНОЕ ЗЕРНО",
    sender: "ТОО GRAIN HOUSE 555",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "low",
    probability: 23,
    date: "13.08.2025",
  },
  {
    id: "36832125",
    document: "ТОО СЕВЕРНОЕ ЗЕРНО",
    sender: "ТОО GRAIN HOUSE 555",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "low",
    probability: 19,
    date: "13.08.2025",
  },
  {
    id: "36828923",
    document: "АКЦИОНЕРНОЕ ОБЩЕСТВО НАЦИОНАЛЬНАЯ КОМПАНИЯ ПРОДОВОЛЬСТВЕННЫЙ",
    sender: "АО Национальная Компания Продовольственная Контрактная Корпорация",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "medium",
    probability: 52,
    date: "13.08.2025",
  },
  {
    id: "36840011",
    document: "АО ЭНЕРГОМАШСТРОЙ",
    sender: "ТОО METAL SUPPLY GROUP",
    receiver: "Казахстан",
    country: "Россия",
    riskLevel: "high",
    probability: 91,
    date: "14.08.2025",
  },
  {
    id: "36840022",
    document: "ООО ТРАНС-ЛОГИСТИКА",
    sender: "ТОО СИБИРЬТРАНС",
    receiver: "Беларусь",
    country: "Россия",
    riskLevel: "medium-high",
    probability: 74,
    date: "14.08.2025",
  },
  {
    id: "36840033",
    document: "АО ХИМПРОМ",
    sender: "ТОО CHEM EXPORT",
    receiver: "Германия",
    country: "Россия",
    riskLevel: "medium",
    probability: 58,
    date: "14.08.2025",
  },
  {
    id: "36840044",
    document: "ООО СИБИРСКИЙ ЛЕС",
    sender: "ТОО TIMBER TRADE",
    receiver: "Китай",
    country: "Россия",
    riskLevel: "low",
    probability: 28,
    date: "14.08.2025",
  },
  {
    id: "36840055",
    document: "АО СТРОЙКОМ",
    sender: "ТОО BUILD HOUSE",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "medium",
    probability: 47,
    date: "14.08.2025",
  },
  {
    id: "36840066",
    document: "ООО АГРОПРОДУКТ",
    sender: "ТОО AGRO EXPORT",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "high",
    probability: 88,
    date: "15.08.2025",
  },
  {
    id: "36840077",
    document: "АО РОСНЕФТЬ-СНАБЖЕНИЕ",
    sender: "ТОО ENERGY TRADE",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "medium-high",
    probability: 71,
    date: "15.08.2025",
  },
  {
    id: "36840088",
    document: "ООО УРАЛХИМ",
    sender: "ТОО CHEMICALS LTD",
    receiver: "Узбекистан",
    country: "Россия",
    riskLevel: "low",
    probability: 22,
    date: "15.08.2025",
  },
  {
    id: "36840099",
    document: "АО ТРАНСМАШХОЛДИНГ",
    sender: "ТОО MACHINES TRADE",
    receiver: "Казахстан",
    country: "Россия",
    riskLevel: "medium",
    probability: 55,
    date: "15.08.2025",
  },
  {
    id: "36840111",
    document: "ООО ВОЛГА-ЭКСПОРТ",
    sender: "ТОО EXPORT LOGISTICS",
    receiver: "Литва",
    country: "Россия",
    riskLevel: "medium-high",
    probability: 69,
    date: "15.08.2025",
  },
  {
    id: "36840122",
    document: "АО СТАЛЬПРОМ",
    sender: "ТОО STEEL TRADE",
    receiver: "Китай",
    country: "Россия",
    riskLevel: "high",
    probability: 95,
    date: "16.08.2025",
  },
  {
    id: "36840133",
    document: "ООО УРАЛСТРОЙ",
    sender: "ТОО BUILD TRADE",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "medium",
    probability: 49,
    date: "16.08.2025",
  },
  {
    id: "36840144",
    document: "АО ЛЕСОПРОМ",
    sender: "ТОО TIMBER EXPORT",
    receiver: "Финляндия",
    country: "Россия",
    riskLevel: "low",
    probability: 31,
    date: "16.08.2025",
  },
  {
    id: "36840155",
    document: "ООО АВТОЭКСПОРТ",
    sender: "ТОО AUTO SUPPLY",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "medium-high",
    probability: 77,
    date: "16.08.2025",
  },
  {
    id: "36840166",
    document: "АО МЕТАЛЛ-ИНВЕСТ",
    sender: "ТОО METAL TRADE",
    receiver: "Россия",
    country: "Россия",
    riskLevel: "high",
    probability: 92,
    date: "16.08.2025",
  },
];

const filteredData = computed(() => {
  return mockData.filter(
    (record) =>
      record.document.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      record.sender.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      record.country.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const handleSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};
</script>
