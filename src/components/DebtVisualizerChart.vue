<script setup>
import { computed } from 'vue'
import { useCashTrack } from '@/composables/useCashTrack'

const { repaymentSchedule, baseSchedule, totalDebt, profile } = useCashTrack()

const maxMonths = computed(() =>
  Math.max(baseSchedule.value.totalMonths, repaymentSchedule.value.totalMonths, 1)
)

function buildPolylinePoints(scheduleMonths) {
  if (!scheduleMonths.length || totalDebt.value <= 0) return ''
  const width = 560
  const height = 150
  const points = [`0,10`] // Start at top-left (100% debt)

  scheduleMonths.forEach((m) => {
    const x = Math.round((m.month / maxMonths.value) * width)
    const ratio = Math.max(0, m.remainingBalance / totalDebt.value)
    const y = Math.round(10 + (1 - ratio) * (height - 20))
    points.push(`${x},${y}`)
  })

  return points.join(' ')
}

const acceleratedPoints = computed(() => buildPolylinePoints(repaymentSchedule.value.months))
const basePoints = computed(() => buildPolylinePoints(baseSchedule.value.months))
</script>

<template>
  <div class="w-full">
    <!-- Legend -->
    <div class="mb-3 flex flex-wrap items-center gap-4 text-[11px]">
      <span class="flex items-center gap-1.5 text-slate-400">
        <span class="h-0.5 w-3 bg-slate-500"></span>
        Base balance (minimums)
      </span>
      <span class="flex items-center gap-1.5 font-medium text-emerald-400">
        <span class="h-0.5 w-3 bg-emerald-400"></span>
        With ${{ profile.extraMonthlyPayment }} extra
      </span>
    </div>

    <!-- Responsive SVG Line Chart -->
    <div class="relative rounded-xl border border-[#1E2822] bg-[#0B0F0D] p-3">
      <svg viewBox="0 0 560 160" class="h-40 w-full overflow-visible">
        <!-- Horizontal Grid Lines -->
        <line x1="0" y1="10" x2="560" y2="10" stroke="#1E2822" stroke-dasharray="3 3" />
        <line x1="0" y1="80" x2="560" y2="80" stroke="#1E2822" stroke-dasharray="3 3" />
        <line x1="0" y1="150" x2="560" y2="150" stroke="#1E2822" />

        <!-- Base Minimums Curve (Muted Gray) -->
        <polyline
          v-if="basePoints"
          fill="none"
          stroke="#64748B"
          stroke-width="2"
          :points="basePoints"
        />

        <!-- Accelerated Curve (Emerald Green) -->
        <polyline
          v-if="acceleratedPoints"
          fill="none"
          stroke="#34D399"
          stroke-width="2.5"
          :points="acceleratedPoints"
        />
      </svg>

      <div class="mt-2 flex justify-between text-[10px] font-mono text-slate-500">
        <span>Nov '26 (${{ Math.round(totalDebt / 1000) }}k)</span>
        <span>Midpoint</span>
        <span>{{ repaymentSchedule.payoffDateLabel }} ($0)</span>
      </div>
    </div>
  </div>
</template>
