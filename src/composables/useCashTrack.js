import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'cash_track_fp_figma_v1'

const defaultProfile = {
  salaryMonthly: 5500,
  freelanceMonthly: 500,
  incomeTaxWithholding: 1000,
  effectiveTaxRate: 25.0,
  filingStatus: 'Single · no dependents',
  zipCode: '78501',
  cityLabel: 'McAllen, TX · 78501',
  localSalesTaxRate: 8.25,
  taxablePurchasesBase: 500,
  // Essential spending breakdown ($2,500 total)
  housing: 1200,
  utilities: 180,
  groceries: 500,
  transport: 380,
  insurance: 240,
  // Strategy & guardrails
  extraMonthlyPayment: 300,
  minCashBuffer: 500,
  payoffStrategy: 'avalanche', // 'avalanche' | 'snowball'
  zipTaxApiKey: ''
}

const defaultLiabilities = [
  {
    id: 'debt-1',
    name: 'Chase Credit Card',
    category: 'Credit Card',
    balance: 12500,
    apr: 19.99,
    minPayment: 250
  },
  {
    id: 'debt-2',
    name: 'Toyota Auto Loan',
    category: 'Auto Loan',
    balance: 15200,
    apr: 6.50,
    minPayment: 430
  },
  {
    id: 'debt-3',
    name: 'Student Loan (Fed)',
    category: 'Student Loan',
    balance: 840,
    apr: 3.50,
    minPayment: 50
  }
]

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        profile: { ...defaultProfile, ...(parsed.profile || {}) },
        liabilities: Array.isArray(parsed.liabilities) ? parsed.liabilities : defaultLiabilities
      }
    }
  } catch (e) {
    console.warn('Storage load fallback:', e)
  }
  return {
    profile: { ...defaultProfile },
    liabilities: [...defaultLiabilities]
  }
}

const initial = loadInitialState()
const profile = ref(initial.profile)
const liabilities = ref(initial.liabilities)
const taxLookupLoading = ref(false)
const taxLookupMessage = ref('')

watch(
  [profile, liabilities],
  () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile: profile.value, liabilities: liabilities.value })
      )
    } catch (e) {
      console.error(e)
    }
  },
  { deep: true }
)

const localZipDirectory = {
  '78501': { city: 'McAllen, TX · 78501', rate: 8.25 },
  '78503': { city: 'McAllen, TX · 78503', rate: 8.25 },
  '78504': { city: 'McAllen, TX · 78504', rate: 8.25 },
  '78539': { city: 'Edinburg, TX · 78539', rate: 8.25 },
  '78541': { city: 'Edinburg, TX · 78541', rate: 8.25 },
  '78572': { city: 'Mission, TX · 78572', rate: 8.25 },
  '78577': { city: 'Pharr, TX · 78577', rate: 8.25 }
}

// Helper to run amortization simulation for any extra payment amount
function simulatePayoff(debtList, extraAmount, strategy) {
  if (!debtList.length) {
    return { months: [], totalMonths: 0, totalInterestPaid: 0, payoffDateLabel: 'Debt Free' }
  }

  let active = debtList
    .filter((d) => d.balance > 0)
    .map((d) => ({ ...d, balance: Number(d.balance), apr: Number(d.apr), minPayment: Number(d.minPayment) }))

  const months = []
  let monthIndex = 0
  let cumulativeInterest = 0
  const startYear = 2026
  const startMonth = 10 // Nov 2026 (0-indexed month 10)

  while (active.some((d) => d.balance > 0.01) && monthIndex < 360) {
    monthIndex++
    active.sort((a, b) => (strategy === 'snowball' ? a.balance - b.balance : b.apr - a.apr))

    let monthlyInterest = 0
    let monthlyPrincipal = 0
    let availableExtra = Math.max(0, Number(extraAmount) || 0)

    for (const debt of active) {
      if (debt.balance <= 0) continue
      const interest = debt.balance * (debt.apr / 100 / 12)
      monthlyInterest += interest
      debt.balance += interest

      const minPay = Math.min(debt.balance, debt.minPayment)
      debt.balance -= minPay
      monthlyPrincipal += Math.max(0, minPay - interest)

      if (debt.minPayment > minPay) {
        availableExtra += debt.minPayment - minPay
      }
    }

    for (const debt of active) {
      if (debt.balance <= 0 || availableExtra <= 0) continue
      const applied = Math.min(debt.balance, availableExtra)
      debt.balance -= applied
      availableExtra -= applied
      monthlyPrincipal += applied
    }

    cumulativeInterest += monthlyInterest
    const remainingBalance = active.reduce((sum, d) => sum + Math.max(0, d.balance), 0)

    const dObj = new Date(startYear, startMonth + monthIndex - 1, 1)
    const dateLabel = dObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }).replace(' ', " '")
    const fullDateLabel = dObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const focusTarget = active.find((d) => d.balance > 0)?.name || 'All Cleared'

    months.push({
      month: monthIndex,
      dateLabel,
      fullDateLabel,
      focusTarget,
      interestPaid: Number(monthlyInterest.toFixed(2)),
      principalPaid: Number(monthlyPrincipal.toFixed(2)),
      totalPaid: Number((monthlyInterest + monthlyPrincipal).toFixed(2)),
      remainingBalance: Number(remainingBalance.toFixed(2))
    })
  }

  const last = months[months.length - 1]
  return {
    months,
    totalMonths: months.length,
    totalInterestPaid: Number(cumulativeInterest.toFixed(2)),
    payoffDateLabel: last ? last.fullDateLabel : 'Nov 2026'
  }
}

export function useCashTrack() {
  async function lookupZipTax(zip) {
    const cleanZip = String(zip || '').trim()
    if (!/^\d{5}$/.test(cleanZip)) {
      taxLookupMessage.value = 'Enter a valid 5-digit ZIP code.'
      return
    }
    taxLookupLoading.value = true
    taxLookupMessage.value = ''
    try {
      if (profile.value.zipTaxApiKey) {
        const res = await fetch(
          `https://zip-tax.com{encodeURIComponent(profile.value.zipTaxApiKey)}&postalcode=${cleanZip}`
        )
        if (res.ok) {
          const data = await res.json()
          if (data?.results?.length > 0) {
            const match = data.results[0]
            profile.value.localSalesTaxRate = Number((match.taxSales * 100).toFixed(2))
            profile.value.cityLabel = `${match.geoCity || 'Local'}, ${match.geoState || 'TX'} · ${cleanZip}`
            taxLookupMessage.value = `Live Zip-Tax synced (${profile.value.localSalesTaxRate}%)`
            taxLookupLoading.value = false
            return
          }
        }
      }
      await new Promise((r) => setTimeout(r, 250))
      if (localZipDirectory[cleanZip]) {
        profile.value.localSalesTaxRate = localZipDirectory[cleanZip].rate
        profile.value.cityLabel = localZipDirectory[cleanZip].city
        taxLookupMessage.value = `Hidalgo County rate · ${localZipDirectory[cleanZip].rate}%`
      } else {
        profile.value.localSalesTaxRate = 8.25
        profile.value.cityLabel = `ZIP ${cleanZip}`
        taxLookupMessage.value = 'Texas municipal benchmark applied (8.25%)'
      }
    } finally {
      taxLookupLoading.value = false
    }
  }

  function addLiability(item) {
    liabilities.value.push({
      id: `debt-${Date.now()}`,
      name: item.name.trim(),
      category: item.category || 'Credit Card',
      balance: Math.max(0, Number(item.balance) || 0),
      apr: Math.max(0, Number(item.apr) || 0),
      minPayment: Math.max(1, Number(item.minPayment) || 0)
    })
  }

  function removeLiability(id) {
    liabilities.value = liabilities.value.filter((d) => d.id !== id)
  }

  function resetAllData() {
    profile.value = { ...defaultProfile }
    liabilities.value = [...defaultLiabilities]
    localStorage.removeItem(STORAGE_KEY)
  }

  // Income & Expense Totals
  const grossMonthlyIncome = computed(
    () => Number(profile.value.salaryMonthly || 0) + Number(profile.value.freelanceMonthly || 0)
  )

  const netTakeHomePay = computed(
    () => Math.max(0, grossMonthlyIncome.value - Number(profile.value.incomeTaxWithholding || 0))
  )

  const totalLivingExpenses = computed(
    () =>
      Number(profile.value.housing || 0) +
      Number(profile.value.utilities || 0) +
      Number(profile.value.groceries || 0) +
      Number(profile.value.transport || 0) +
      Number(profile.value.insurance || 0)
  )

  const estimatedMonthlySalesTaxDrag = computed(
    () => (Number(profile.value.taxablePurchasesBase || 500) * Number(profile.value.localSalesTaxRate || 8.25)) / 100
  )

  // Debt Metrics
  const totalDebt = computed(() =>
    liabilities.value.reduce((sum, item) => sum + Number(item.balance || 0), 0)
  )

  const totalMinPayments = computed(() =>
    liabilities.value.reduce((sum, item) => sum + Number(item.minPayment || 0), 0)
  )

  const cashRemainingAfterMinimums = computed(
    () => netTakeHomePay.value - totalLivingExpenses.value - estimatedMonthlySalesTaxDrag.value - totalMinPayments.value
  )

  const leftoverCash = computed(
    () => cashRemainingAfterMinimums.value - Number(profile.value.extraMonthlyPayment || 0)
  )

  // Sorted liabilities for payoff table
  const sortedLiabilities = computed(() => {
    const copy = [...liabilities.value]
    return copy.sort((a, b) =>
      profile.value.payoffStrategy === 'snowball' ? a.balance - b.balance : b.apr - a.apr
    )
  })

  // Schedules: Accelerated (with extra) vs Base (minimums only)
  const repaymentSchedule = computed(() =>
    simulatePayoff(liabilities.value, profile.value.extraMonthlyPayment, profile.value.payoffStrategy)
  )

  const baseSchedule = computed(() =>
    simulatePayoff(liabilities.value, 0, profile.value.payoffStrategy)
  )

  return {
    profile,
    liabilities,
    sortedLiabilities,
    taxLookupLoading,
    taxLookupMessage,
    lookupZipTax,
    addLiability,
    removeLiability,
    resetAllData,
    grossMonthlyIncome,
    netTakeHomePay,
    totalLivingExpenses,
    estimatedMonthlySalesTaxDrag,
    totalDebt,
    totalMinPayments,
    cashRemainingAfterMinimums,
    leftoverCash,
    repaymentSchedule,
    baseSchedule
  }
}
