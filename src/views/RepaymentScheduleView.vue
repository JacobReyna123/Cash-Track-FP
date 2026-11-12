<script setup>
import { useCashTrack } from '@/composables/useCashTrack'
import DebtVisualizerChart from '@/components/DebtVisualizerChart.vue'

const { profile, repaymentSchedule } = useCashTrack()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Full Repayment Schedule</h1>
        <p class="mt-1 text-xs text-slate-400">
          Month-by-month principal reduction, interest charges, and remaining balance.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="flex rounded-xl border border-[#24302A] bg-[#121815] p-1">
          <button
            type="button"
            @click="profile.payoffStrategy = 'avalanche'"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="profile.payoffStrategy === 'avalanche' ? 'bg-emerald-400 text-[#0A0D0B]' : 'text-slate-400 hover:text-white'"
          >
            Highest Interest First
          </button>
          <button
            type="button"
            @click="profile.payoffStrategy = 'snowball'"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="profile.payoffStrategy === 'snowball' ? 'bg-emerald-400 text-[#0A0D0B]' : 'text-slate-400 hover:text-white'"
          >
            Lowest Balance First
          </button>
        </div>

        <div class="flex items-center gap-2 rounded-xl border border-[#24302A] bg-[#121815] px-3 py-1.5 text-xs">
          <span class="text-slate-400">Extra/mo:</span>
          <span class="text-emerald-400 font-mono font-bold">$</span>
          <input
            v-model.number="profile.extraMonthlyPayment"
            type="number"
            min="0"
            step="25"
            class="w-16 bg-transparent font-mono font-bold text-white focus:outline-none"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4">
        <span class="text-[10px] uppercase tracking-wider text-slate-400">Estimated Debt-Free</span>
        <div class="mt-1 text-2xl font-bold text-emerald-400">{{ repaymentSchedule.payoffDateLabel }}</div>
      </div>
      <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4">
        <span class="text-[10px] uppercase tracking-wider text-slate-400">Total Months</span>
        <div class="mt-1 text-2xl font-bold font-mono text-white">{{ repaymentSchedule.totalMonths }} months</div>
      </div>
      <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-4">
        <span class="text-[10px] uppercase tracking-wider text-slate-400">Total Interest Paid</span>
        <div class="mt-1 text-2xl font-bold font-mono text-rose-400">
          ${{ repaymentSchedule.totalInterestPaid.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5">
      <DebtVisualizerChart />
    </div>

    <div class="overflow-hidden rounded-2xl border border-[#1E2822] bg-[#121815]">
      <div class="overflow-x-auto max-h-[520px]">
        <table class="w-full text-left text-xs">
          <thead class="sticky top-0 z-10 border-b border-[#1E2822] bg-[#0D120F] text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th class="px-5 py-3">Month</th>
              <th class="px-5 py-3">Date</th>
              <th class="px-5 py-3">Priority Target</th>
              <th class="px-5 py-3 text-right">Principal</th>
              <th class="px-5 py-3 text-right">Interest</th>
              <th class="px-5 py-3 text-right">Payment</th>
              <th class="px-5 py-3 text-right">Remaining Balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1A221E] font-mono text-[11px]">
            <tr
              v-for="row in repaymentSchedule.months"
              :key="row.month"
              class="hover:bg-[#161E1A]"
            >
              <td class="px-5 py-2.5 font-sans text-slate-400">#{{ row.month }}</td>
              <td class="px-5 py-2.5 font-sans text-slate-200">{{ row.dateLabel }}</td>
              <td class="px-5 py-2.5 font-sans">
                <span class="rounded bg-[#17261E] px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  {{ row.focusTarget }}
                </span>
              </td>
              <td class="px-5 py-2.5 text-right text-emerald-400">${{ row.principalPaid.toFixed(2) }}</td>
              <td class="px-5 py-2.5 text-right text-rose-400">${{ row.interestPaid.toFixed(2) }}</td>
              <td class="px-5 py-2.5 text-right text-slate-200">${{ row.totalPaid.toFixed(2) }}</td>
              <td class="px-5 py-2.5 text-right font-bold text-white">${{ row.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
