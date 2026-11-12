<script setup>
import { reactive } from 'vue'
import { X, PlusCircle } from '@lucide/vue'
import { useCashTrack } from '@/composables/useCashTrack'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const { addLiability } = useCashTrack()

const form = reactive({
  name: '',
  category: 'Credit Card',
  balance: '',
  apr: '',
  minPayment: ''
})

function handleSubmit() {
  if (!form.name || Number(form.balance) <= 0) return

  addLiability({
    name: form.name,
    category: form.category,
    balance: Number(form.balance),
    apr: Number(form.apr) || 0,
    minPayment: Number(form.minPayment) || 25
  })

  form.name = ''
  form.category = 'Credit Card'
  form.balance = ''
  form.apr = ''
  form.minPayment = ''
  emit('close')
}
</script>

<template>
  <div
    v-if="props.isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md rounded-2xl border border-[#24302A] bg-[#121815] p-6 shadow-2xl">
      <div class="flex items-center justify-between border-b border-[#1E2822] pb-4">
        <div>
          <h3 class="text-base font-bold text-white">Add New Liability</h3>
          <p class="text-xs text-slate-400">Append a credit card, loan, or recurring bill</p>
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="rounded-lg p-1 text-slate-400 hover:bg-[#1B241F] hover:text-white"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-5 space-y-4">
        <div>
          <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Liability Name
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="e.g., Chase Credit Card"
            class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Category
          </label>
          <select
            v-model="form.category"
            class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
          >
            <option>Credit Card</option>
            <option>Auto Loan</option>
            <option>Student Loan</option>
            <option>Personal Loan</option>
            <option>Medical / Bill</option>
          </select>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Balance ($)
            </label>
            <input
              v-model="form.balance"
              type="number"
              step="0.01"
              min="1"
              required
              placeholder="2500"
              class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
              APR (%)
            </label>
            <input
              v-model="form.apr"
              type="number"
              step="0.01"
              min="0"
              max="99"
              required
              placeholder="19.99"
              class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Min / Mo ($)
            </label>
            <input
              v-model="form.minPayment"
              type="number"
              step="1"
              min="1"
              required
              placeholder="125"
              class="w-full rounded-lg border border-[#24302A] bg-[#0B0F0D] px-3 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3 border-t border-[#1E2822] pt-4">
          <button
            type="button"
            @click="emit('close')"
            class="rounded-lg border border-[#24302A] px-4 py-2 text-xs font-medium text-slate-300 hover:bg-[#1B241F]"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-[#0A0D0B] transition hover:bg-emerald-300"
          >
            <PlusCircle class="h-4 w-4" />
            Add Liability
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
