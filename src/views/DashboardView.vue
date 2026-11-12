<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Trash2, ArrowRight, CheckCircle2, AlertTriangle } from '@lucide/vue'
import { useCashTrack } from '@/composables/useCashTrack'
import AddLiabilityModal from '@/components/AddLiabilityModal.vue'
import DebtVisualizerChart from '@/components/DebtVisualizerChart.vue'

const {
  profile,
  liabilities,
  sortedLiabilities,
  removeLiability,
  grossMonthlyIncome,
  totalLivingExpenses,
  estimatedMonthlySalesTaxDrag,
  totalDebt,
  totalMinPayments,
  leftoverCash,
  repaymentSchedule
} = useCashTrack()

const isModalOpen = ref(false)

const previewMonths = computed(() => repaymentSchedule.value.months.slice(0, 3))
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header & Strategy Toggle -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Interactive Dashboard</h1>
        <p class="mt-1 text-xs text-slate-400">
          Editable · Illustrative data only · not financial advice
        </p>
      </div>

      <!-- Avalanche vs Snowball Toggle -->
      <div class="flex rounded-xl border border-[#24302A] bg-[#121815] p-1">
        <button
          type="button"
          @click="profile.payoffStrategy = 'avalanche'"
          class="rounded-lg px-3.5 py-1.5 text-xs font-semibold transition"
          :class="profile.payoffStrategy === 'avalanche' ? 'bg-emerald-400 text-[#0A0D0B]' : 'text-slate-400 hover:text-white'"
        >
          Highest Interest First
        </button>
        <button
          type="button"
          @click="profile.payoffStrategy = 'snowball'"
          class="rounded-lg px-3.5 py-1.5 text-xs font-semibold transition"
          :class="profile.payoffStrategy === 'snowball' ? 'bg-emerald-400 text-[#0A0D0B]' : 'text-slate-400 hover:text-white'"
        >
          Lowest Balance First
        </button>
      </div>
    </div>

    <!-- Top 3 Summary KPI Cards -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5">
        <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Total Combined Debt
        </span>
        <div class="mt-2 text-3xl font-bold font-mono text-white">
          ${{ totalDebt.toLocaleString() }}
        </div>
        <p class="mt-1 text-xs text-slate-400">
          across {{ liabilities.length }} {{ liabilities.length === 1 ? 'liability' : 'liabilities' }}
        </p>
      </div>

      <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5">
        <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Monthly Minimum Due
        </span>
        <div class="mt-2 text-3xl font-bold font-mono text-white">
          ${{ totalMinPayments.toLocaleString() }}
        </div>
        <p class="mt-1 text-xs text-slate-400">
          current total minimum payment
        </p>
      </div>

      <div
        class="rounded-2xl border p-5"
        :class="leftoverCash >= 0 ? 'border-emerald-500/35 bg-[#121C17]' : 'border-rose-500/45 bg-[#1D1214]'"
      >
        <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          Estimated Leftover Cash
        </span>
        <div
          class="mt-2 text-3xl font-bold font-mono"
          :class="leftoverCash >= 0 ? 'text-emerald-400' : 'text-rose-400'"
        >
          ${{ leftoverCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </div>
        <p class="mt-1 text-[11px] text-slate-400">
          available after ${{ grossMonthlyIncome.toLocaleString() }} gross, taxes, ${{ totalLivingExpenses.toLocaleString() }} living &amp; debt
        </p>
      </div>
    </div>

    <!-- Middle Split Section: Active Bills (Left) & Live Repayment Plan (Right) -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column (5 cols): Active Bills & Loans -->
      <div class="space-y-4 lg:col-span-5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-white">Active Bills &amp; Loans</h2>
          <span class="text-xs text-slate-400">{{ liabilities.length }} liabilities</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in liabilities"
            :key="item.id"
            class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4 transition hover:border-[#2C3B33]"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <span
                  class="h-2 w-2 rounded-full"
                  :class="item.apr >= 15 ? 'bg-rose-400' : 'bg-emerald-400'"
                ></span>
                <h3 class="text-sm font-bold text-white">{{ item.name }}</h3>
                <span
                  v-if="item.apr >= 15"
                  class="rounded bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-400"
                >
                  High Interest
                </span>
              </div>

              <button
                type="button"
                @click="removeLiability(item.id)"
                class="rounded p-1 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                title="Remove liability"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>

            <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span class="block text-[10px] text-slate-500">Balance</span>
                <span class="font-mono font-bold text-white">${{ item.balance.toLocaleString() }}</span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500">APR</span>
                <span
                  class="font-mono font-bold"
                  :class="item.apr >= 15 ? 'text-rose-400' : 'text-emerald-400'"
                >
                  {{ item.apr }}%
                </span>
              </div>
              <div>
                <span class="block text-[10px] text-slate-500">Min. Payment</span>
                <span class="font-mono font-bold text-slate-200">${{ item.minPayment }}</span>
              </div>
            </div>

            <p class="mt-2.5 border-t border-[#1A221E] pt-2 text-[11px] text-slate-500">
              ~${{ ((item.balance * (item.apr / 100)) / 12).toFixed(2) }} interest accrued this month
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="isModalOpen = true"
          class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#2A3830] bg-[#0E1310] py-3.5 text-xs font-semibold text-emerald-400 transition hover:border-emerald-400 hover:bg-[#141D18]"
        >
          <Plus class="h-4 w-4" />
          Add New Liability
        </button>
      </div>

      <!-- Right Column (7 cols): Live Repayment Plan -->
      <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5 space-y-5 lg:col-span-7">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 class="text-sm font-bold text-white">Live Repayment Plan</h2>
            <p class="text-[11px] text-slate-400">Projected Debt Reduction Timeline</p>
          </div>
          <span class="rounded-full border border-emerald-500/30 bg-[#16261E] px-3 py-1 text-xs font-semibold text-emerald-400">
            Debt-free: {{ repaymentSchedule.payoffDateLabel }}
          </span>
        </div>

        <DebtVisualizerChart />

        <div class="rounded-xl border border-[#1E2822] bg-[#0B0F0D] p-4 space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-white">Simulate Extra Payment</span>
              <span class="block text-[11px] text-slate-400">Allocate Extra Cash</span>
            </div>
            <span class="font-mono text-sm font-bold text-emerald-400">
              +${{ profile.extraMonthlyPayment }} / mo
            </span>
          </div>

          <input
            v-model.number="profile.extraMonthlyPayment"
            type="range"
            min="0"
            max="1700"
            step="25"
            class="w-full accent-emerald-400 cursor-pointer"
          />

          <div class="flex justify-between text-[10px] font-mono text-slate-500">
            <span>$0</span>
            <span>$850</span>
            <span>$1,700 / mo</span>
          </div>

          <p class="text-[11px] text-emerald-400">
            &bull; New estimated debt-free date: <strong>{{ repaymentSchedule.payoffDateLabel }}</strong> ({{ repaymentSchedule.totalMonths }} monthly payments)
          </p>
        </div>

        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-white">Month-by-Month Schedule</h3>
            <RouterLink
              to="/schedule"
              class="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline"
            >
              View full schedule
              <ArrowRight class="h-3 w-3" />
            </RouterLink>
          </div>

          <div class="overflow-x-auto rounded-xl border border-[#1E2822] bg-[#0B0F0D]">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#1E2822] text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th class="px-3 py-2">Month</th>
                  <th class="px-3 py-2 text-right">Payment</th>
                  <th class="px-3 py-2 text-right">Interest</th>
                  <th class="px-3 py-2 text-right">Principal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="month in previewMonths" :key="month.month" class="border-b border-[#1A221E] last:border-0">
                  <td class="px-3 py-2 text-slate-300">{{ month.label }}</td>
                  <td class="px-3 py-2 text-right font-mono text-white">${{ month.payment.toLocaleString() }}</td>
                  <td class="px-3 py-2 text-right font-mono text-rose-400">${{ month.interest.toLocaleString() }}</td>
                  <td class="px-3 py-2 text-right font-mono text-emerald-400">${{ month.principal.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddLiabilityModal v-if="isModalOpen" @close="isModalOpen = false" />
</template>
