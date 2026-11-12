<script setup>
import { ref } from 'vue'
import { Check, Plus, Trash2, ArrowRight, RotateCcw } from '@lucide/vue'
import { useCashTrack } from '@/composables/useCashTrack'
import AddLiabilityModal from '@/components/AddLiabilityModal.vue'

const {
  profile,
  liabilities,
  removeLiability,
  resetAllData,
  taxLookupLoading,
  taxLookupMessage,
  lookupZipTax,
  grossMonthlyIncome,
  netTakeHomePay,
  totalLivingExpenses,
  estimatedMonthlySalesTaxDrag,
  totalDebt,
  totalMinPayments,
  cashRemainingAfterMinimums,
  leftoverCash,
  repaymentSchedule
} = useCashTrack()

const isModalOpen = ref(false)
const savedToast = ref(false)

const spendingFields = [
  { key: 'housing', label: 'Housing' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'groceries', label: 'Groceries' },
  { key: 'transport', label: 'Transport' },
  { key: 'insurance', label: 'Insurance' }
]

function handleSaveProfile() {
  savedToast.value = true
  setTimeout(() => {
    savedToast.value = false
  }, 2500)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Your numbers. One clear picture.</h1>
        <p class="mt-1 text-xs text-slate-400">
          Bring income, everyday expenses, and debt into a plan built around real life.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="resetAllData"
          class="flex items-center gap-1.5 rounded-lg border border-[#24302A] bg-[#121815] px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400"
        >
          <RotateCcw class="h-3.5 w-3.5" />
          Reset
        </button>

        <button
          type="button"
          @click="handleSaveProfile"
          class="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-[#17261E] px-4 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500 hover:text-[#0A0D0B]"
        >
          <Check class="h-3.5 w-3.5" />
          {{ savedToast ? 'Financial profile saved!' : 'Save financial profile' }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#1E2822] bg-[#101512] px-4 py-2.5 text-xs">
      <div class="flex items-center gap-2 text-slate-300">
        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
        <span>Your profile is ready to plan. Review the sample values or make them your own.</span>
      </div>
      <span class="font-medium text-emerald-400">All sections complete</span>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <section class="rounded-2xl border border-[#1E2822] bg-[#121815] p-5 space-y-4">
          <div>
            <h2 class="text-sm font-bold text-white">Income &amp; estimated taxes</h2>
            <p class="text-[11px] text-slate-400">Start with gross income, before taxes and deductions.</p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label class="mb-1 block text-[11px] text-slate-400">Salary / month</label>
              <div class="flex items-center rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2">
                <span class="text-xs text-slate-500">$</span>
                <input
                  v-model.number="profile.salaryMonthly"
                  type="number"
                  min="0"
                  step="50"
                  class="w-full bg-transparent px-1.5 text-sm font-mono font-semibold text-white focus:outline-none"
                />
                <span class="text-[10px] font-semibold text-slate-500">USD</span>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-[11px] text-slate-400">Freelance / month</label>
              <div class="flex items-center rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2">
                <span class="text-xs text-slate-500">$</span>
                <input
                  v-model.number="profile.freelanceMonthly"
                  type="number"
                  min="0"
                  step="50"
                  class="w-full bg-transparent px-1.5 text-sm font-mono font-semibold text-white focus:outline-none"
                />
                <span class="text-[10px] font-semibold text-slate-500">USD</span>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-[11px] text-slate-400">Gross income / month</label>
              <div class="flex items-center justify-between rounded-lg border border-[#1E2822] bg-[#0E1310] px-3 py-2">
                <span class="text-sm font-mono font-bold text-emerald-400">
                  ${{ grossMonthlyIncome.toLocaleString() }}
                </span>
                <span class="text-[10px] font-semibold text-slate-500">USD</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-[11px] text-slate-400">Tax location</label>
              <input
                v-model="profile.cityLabel"
                type="text"
                class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label class="mb-1 block text-[11px] text-slate-400">Filing status</label>
              <select
                v-model="profile.filingStatus"
                class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2 text-xs text-slate-200 focus:border-emerald-400 focus:outline-none"
              >
                <option>Single · no dependents</option>
                <option>Married filing jointly</option>
                <option>Head of household</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2822] bg-[#0E1310] p-3.5">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-200">Estimated income-tax withholding</span>
                <span class="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
                  Illustrative estimate
                </span>
              </div>
              <p class="mt-0.5 text-[11px] text-slate-500">
                Federal + state blended reserve · not a tax-filing calculation
              </p>
            </div>
            <div class="flex items-center rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-1.5">
              <span class="text-xs text-slate-500">$</span>
              <input
                v-model.number="profile.incomeTaxWithholding"
                type="number"
                min="0"
                step="25"
                class="w-24 bg-transparent pl-1 text-right text-sm font-mono font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          <div class="rounded-xl border border-[#1E2822] bg-[#0E1310] p-4 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs font-semibold text-slate-200">Local sales-tax benchmark</span>
              <span class="rounded border border-[#24302A] bg-[#141B17] px-2 py-0.5 text-[10px] text-slate-400">
                Not live · Illustrative benchmark
              </span>
            </div>

            <div>
              <label class="mb-1 block text-[11px] text-slate-400">ZIP code (Hidalgo County)</label>
              <div class="flex gap-2">
                <div class="flex flex-1 items-center justify-between rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2">
                  <input
                    v-model="profile.zipCode"
                    type="text"
                    maxlength="5"
                    class="w-24 bg-transparent text-xs font-mono font-semibold text-white focus:outline-none"
                  />
                  <span class="text-[11px] text-slate-500">{{ profile.cityLabel }}</span>
                </div>
                <button
                  type="button"
                  @click="lookupZipTax(profile.zipCode)"
                  :disabled="taxLookupLoading"
                  class="rounded-lg border border-[#24302A] bg-[#161E1A] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  {{ taxLookupLoading ? 'Looking up...' : 'Look up rate' }}
                </button>
              </div>
              <p v-if="taxLookupMessage" class="mt-1.5 text-[11px] text-emerald-400">
                {{ taxLookupMessage }}
              </p>
            </div>

            <div class="flex items-center justify-between border-t border-[#1E2822] pt-3">
              <div>
                <p class="text-xs font-medium text-slate-200">
                  Hidalgo County rate · {{ profile.localSalesTaxRate }}%
                </p>
                <p class="text-[11px] text-slate-500">
                  Applied to ${{ profile.taxablePurchasesBase }} est. taxable purchases · not to gross income
                </p>
              </div>
              <div class="text-right">
                <span class="text-sm font-mono font-bold text-white">
                  ${{ estimatedMonthlySalesTaxDrag.toFixed(2) }}
                </span>
                <span class="block text-[10px] text-slate-500">est. / month</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

