<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

const pageBreadcrumb = computed(() => {
  const map = {
    '/': 'Dashboard',
    '/profile': 'Financial profile',
    '/simulator': 'Simulations',
    '/schedule': 'Repayment Schedule'
  }
  return map[route.path] || 'Dashboard'
})
</script>

<template>
  <div class="min-h-screen bg-[#0A0D0B] text-slate-100 flex flex-col lg:flex-row">
    <Navbar />

    <div class="flex flex-1 flex-col min-w-0">
      <!-- Top Workspace Header Bar -->
      <header class="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2622] bg-[#0D120F]/80 px-6 py-3 text-xs">
        <div class="flex items-center gap-2 text-slate-400">
          <span>Workspace</span>
          <span>/</span>
          <span class="font-medium text-slate-200">{{ pageBreadcrumb }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            Sample Data
          </span>
          <span class="rounded border border-[#242E29] bg-[#141A17] px-2.5 py-0.5 text-[11px] text-slate-300">
            Plan starts Nov 2026
          </span>
        </div>
      </header>

      <!-- Active View -->
      <main class="mx-auto w-full max-w-6xl flex-1 p-5 sm:p-8">
        <RouterView />
      </main>

      <!-- Footer -->
      <footer class="flex flex-wrap items-center justify-between gap-2 border-t border-[#1A211D] px-6 py-3 text-[11px] text-slate-500">
        <span>&copy; 2026 Cash-Track · Illustrative sample data · Estimates are for planning only, not financial or tax advice.</span>
        <span>USD · Monthly view</span>
      </footer>
    </div>
  </div>
</template>
