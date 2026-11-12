<script setup>
import { computed } from 'vue'
import { Sliders, AlertTriangle, CheckCircle2 } from '@lucide/vue'
import { useCashTrack } from '@/composables/useCashTrack'
import DebtVisualizerChart from '@/components/DebtVisualizerChart.vue'

const {
  profile,
  grossMonthlyIncome,
  totalLivingExpenses,
  estimatedMonthlySalesTaxDrag,
  totalMinPayments,
  repaymentSchedule,
  baseSchedule
} = useCashTrack()

const estimatedTaxReserve = computed(() =>
  Math.round((grossMonthlyIncome.value * Number(profile.value.effectiveTaxRate || 25)) / 100)
)

const simulatedTakeHome = computed(() =>
  Math.max(0, grossMonthlyIncome.value - estimatedTaxReserve.value)
)

const simulatedBuffer = computed(() =>
  simulatedTakeHome.value -
  totalLivingExpenses.value -
  estimatedMonthlySalesTaxDrag.value -
  (totalMinPayments.value + Number(profile.value.extraMonthlyPayment || 0))
)

const interestSaved = computed(() =>
  Math.max(0, Math.round(baseSchedule.value.totalInterestPaid - repaymentSchedule.value.totalInterestPaid))
)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">What if your income changed?</h1>
        <p class="mt-1 text-xs text-slate-400">
          Explore the trade-offs before changing your real-world plan.
        </p>
      </div>

      <span class="rounded-lg border border-[#24302A] bg-[#121815] px-3 py-1.5 text-xs text-slate-400">
        Interactive Sandbox · Auto-saved
      </span>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="space-y-5 lg:col-span-5">
        <section class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5 space-y-4">
          <div class="flex items-center gap-2">
            <Sliders class="h-4 w-4 text-emerald-400" />
            <h2 class="text-sm font-bold text-white">Shape the scenario</h2>
          </div>

          <div>
            <div class="mb-1 flex justify-between text-xs">
              <span class="text-slate-400">Salary / month</span>
              <span class="font-mono font-bold text-white">${{ Number(profile.salaryMonthly).toLocaleString() }}</span>
            </div>
            <input
              v-model.number="profile.salaryMonthly"
              type="range"
              min="1500"
              max="12000"
              step="100"
              class="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div>
            <div class="mb-1 flex justify-between text-xs">
              <span class="text-slate-400">Freelance / month</span>
              <span class="font-mono font-bold text-emerald-400">+${{ Number(profile.freelanceMonthly).toLocaleString() }}</span>
            </div>
            <input
              v-model.number="profile.freelanceMonthly"
              type="range"
              min="0"
              max="5000"
              step="100"
              class="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div class="flex items-center justify-between border-t border-[#1E2822] pt-3 text-xs">
            <span class="text-slate-400">Gross income / month</span>
            <span class="font-mono text-base font-bold text-white">${{ grossMonthlyIncome.toLocaleString() }}</span>
          </div>

          <div class="rounded-xl border border-[#1E2822] bg-[#0B0F0D] p-3.5 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-300 font-medium">Effective tax rate (%)</span>
              <input
                v-model.number="profile.effectiveTaxRate"
                type="number"
                min="0"
                max="50"
                step="0.5"
                class="w-20 rounded border border-[#24302A] bg-[#121815] px-2 py-1 text-right font-mono text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div class="flex justify-between text-xs text-slate-400">
              <span>Monthly tax reserve</span>
              <span class="font-mono text-slate-200">${{ estimatedTaxReserve.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-xs font-semibold">
              <span class="text-slate-200">Estimated take-home</span>
              <span class="font-mono text-emerald-400">${{ simulatedTakeHome.toLocaleString() }}</span>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5 space-y-4">
          <h2 class="text-sm font-bold text-white">Payment guardrails</h2>

          <div>
            <div class="mb-1 flex justify-between text-xs">
              <span class="text-slate-400">Extra debt payment / month</span>
              <span class="font-mono font-bold text-emerald-400">+${{ profile.extraMonthlyPayment }}</span>
            </div>
            <input
              v-model.number="profile.extraMonthlyPayment"
              type="range"
              min="0"
              max="1500"
              step="25"
              class="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div>
            <div class="mb-1 flex justify-between text-xs">
              <span class="text-slate-400">Minimum cash buffer / month</span>
              <span class="font-mono font-bold text-white">${{ profile.minCashBuffer }}</span>
            </div>
            <input
              v-model.number="profile.minCashBuffer"
              type="range"
              min="0"
              max="2000"
              step="50"
              class="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </section>
      </div>

      <div class="space-y-5 lg:col-span-7">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4">
            <span class="text-[10px] uppercase tracking-wider text-slate-400">Monthly cash buffer</span>
            <div
              class="mt-1 text-2xl font-bold font-mono"
              :class="simulatedBuffer >= profile.minCashBuffer ? 'text-emerald-400' : 'text-rose-400'"
            >
              ${{ simulatedBuffer.toFixed(0) }}
            </div>
            <p class="mt-1 text-[11px] text-slate-500">Target buffer: ${{ profile.minCashBuffer }}</p>
          </div>

          <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4">
            <span class="text-[10px] uppercase tracking-wider text-slate-400">Estimated debt-free</span>
            <div class="mt-1 text-2xl font-bold text-emerald-400">
              {{ repaymentSchedule.payoffDateLabel }}
            </div>
            <p class="mt-1 text-[11px] text-slate-500">{{ repaymentSchedule.totalMonths }} monthly payments</p>
          </div>

          <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4">
            <span class="text-[10px] uppercase tracking-wider text-slate-400">Total projected interest</span>
            <div class="mt-1 text-2xl font-bold font-mono text-white">
              ${{ Math.round(repaymentSchedule.totalInterestPaid).toLocaleString() }}
            </div>
            <p class="mt-1 text-[11px] text-emerald-400">${{ interestSaved.toLocaleString() }} saved vs minimums</p>
          </div>
        </div>

        <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5 space-y-4">
          <div>
            <h2 class="text-sm font-bold text-white">More income. A shorter path.</h2>
            <p class="text-[11px] text-slate-400">
              Comparing baseline minimums against your accelerated payoff curve
            </p>
          </div>

          <DebtVisualizerChart />
        </div>

        <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5 space-y-3">
          <h2 class="text-sm font-bold text-white">Compare payment strategies</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#1E2822] text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th class="pb-2">Plan</th>
                  <th class="pb-2 text-right">Debt / Mo</th>
                  <th class="pb-2 text-right">Buffer / Mo</th>
                  <th class="pb-2 text-right">Payments</th>
                  <th class="pb-2 text-right">Interest</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1A221E] font-mono text-[11px]">
                <tr>
                  <td class="py-2.5 font-sans font-semibold text-emerald-400">Accelerated ({{ profile.payoffStrategy }})</td>
                  <td class="py-2.5 text-right text-white">${{ (totalMinPayments + Number(profile.extraMonthlyPayment)).toLocaleString() }}</td>
                  <td class="py-2.5 text-right text-emerald-400">${{ simulatedBuffer.toFixed(0) }}</td>
                  <td class="py-2.5 text-right text-slate-200">{{ repaymentSchedule.totalMonths }}</td>
                  <td class="py-2.5 text-right text-slate-200">${{ Math.round(repaymentSchedule.totalInterestPaid).toLocaleString() }}</td>
                </tr>
                <tr>
                  <td class="py-2.5 font-sans text-slate-300">Minimums only</td>
                  <td class="py-2.5 text-right text-slate-300">${{ totalMinPayments.toLocaleString() }}</td>
                  <td class="py-2.5 text-right text-slate-300">${{ (simulatedBuffer + Number(profile.extraMonthlyPayment)).toFixed(0) }}</td>
                  <td class="py-2.5 text-right text-slate-400">{{ baseSchedule.totalMonths }}</td>
                  <td class="py-2.5 text-right text-rose-400">${{ Math.round(baseSchedule.totalInterestPaid).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

