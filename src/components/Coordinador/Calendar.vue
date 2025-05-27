<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth">‹</button>
      <span>{{ monthName }} {{ currentDate.getFullYear() }}</span>
      <button @click="nextMonth">›</button>
    </div>

    <div class="days-grid">
      <div class="day-name" v-for="(day, i) in days" :key="i">{{ day }}</div>

      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'day',
          day === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
            ? 'today'
            : '',
          day === props.selectedDay ? 'selected' : '',
        ]"
        @click="selectDay(day)"
      >
        {{ day || "" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["selectDay", "changeMonth", "changeYear"]);
//Recibe también selectedMonth y selectedYear como props.
const props = defineProps({
  selectedDay: {
    type: Number,
    default: null,
  },
  selectedMonth: {
    type: Number,
    required: true,
  },
  selectedYear: {
    type: Number,
    required: true,
  },
});

const today = new Date();
const currentDate = ref(new Date());
const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

const monthName = computed(() =>
  currentDate.value.toLocaleString("default", { month: "long" })
);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getStartDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

// Computa los días del mes actual, incluyendo los días vacíos al inicio.
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  const daysArray = Array(startDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return daysArray;
});



// Sincroniza currentDate con selectedMonth y selectedYear.
watch(
  () => [props.selectedMonth, props.selectedYear],
  ([newMonth, newYear]) => {
    currentDate.value = new Date(newYear, newMonth, 1);
  }
);

function prevMonth() {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
  emit("changeMonth", currentDate.value.getMonth());
  emit("changeYear", currentDate.value.getFullYear());
}

function nextMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  currentDate.value = new Date(currentDate.value);
  emit("changeMonth", currentDate.value.getMonth());
  emit("changeYear", currentDate.value.getFullYear());
}

function selectDay(day) {
  if (!day) return;
  emit("selectDay", day);
}
</script>

<style scoped>
.calendar-container {
  background-color: #1e2a2a;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", sans-serif;
  transition: all 0.3s ease;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}

.calendar-header button {
  background: none;
  color: white;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.calendar-header button:hover {
  color: #5cd3ff;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
}

.day-name {
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  color: #cfd2d3;
}

.day {
  padding: 0.6rem;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.day:hover {
  background-color: #3c5052;
}

.selected {
  background-color: #5cd3ff;
  color: black;
  font-weight: bold;
}

.today {
  outline: 2px solid #5cd3ff;
  border-radius: 8px;
}
</style>
