<script setup>
import { RouterLink } from 'vue-router'
import { LayoutDashboard, UserCheck, SlidersHorizontal, Table2, ShieldCheck } from '@lucide/vue'

const navItems = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Financial profile', to: '/profile', icon: UserCheck },
  { name: 'Simulations', to: '/simulator', icon: SlidersHorizontal },
  { name: 'Repayment Schedule', to: '/schedule', icon: Table2 }
]
</script>

<template>
  <aside class="flex w-full flex-col justify-between border-b border-[#1E2622] bg-[#0D120F] p-4 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
    <div>
      <!-- Brand Header -->
      <RouterLink to="/" class="flex items-center gap-2.5 px-2 py-1.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 text-[#0A0D0B] font-extrabold text-sm">
          ll
        </div>
        <span class="text-base font-bold tracking-tight text-white">Cash-Track</span>
      </RouterLink>

      <!-- Workspace Section -->
      <div class="mt-6">
        <p class="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Your Workspace
        </p>
        <nav class="mt-2 flex gap-1 overflow-x-auto lg:flex-col">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-[#161D19] hover:text-slate-200 whitespace-nowrap"
            active-class="!bg-[#17261E] !text-emerald-400 border border-emerald-500/25"
          >
            <component :is="item.icon" class="h-4 w-4 shrink-0" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </nav>
      </div>

      <!-- "A plan that adds up" Info Card -->
      <div class="mt-6 hidden rounded-xl border border-[#1E2822] bg-[#121815] p-3.5 lg:block">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <ShieldCheck class="h-3.5 w-3.5" />
          <span>A plan that adds up</span>
        </div>
        <p class="mt-1.5 text-[11px] leading-relaxed text-slate-400">
          Every dollar has a job. Your future has room to grow.
        </p>
        <p class="mt-2 text-[10px] font-medium text-emerald-400/80">
          Monthly planning · USD
        </p>
      </div>
    </div>

    <!-- Bottom User Profile Pill -->
    <div class="mt-6 hidden items-center gap-3 border-t border-[#1E2622] pt-4 lg:flex">
      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#192820] text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
        AJ
      </div>
      <div>
        <p class="text-xs font-semibold text-slate-200">Alex Johnson</p>
        <p class="text-[10px] text-slate-500">Personal workspace</p>
      </div>
    </div>
  </aside>
</template>
