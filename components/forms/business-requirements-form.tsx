"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useRef } from "react"
import countriesData from "world-countries"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function BusinessRequirementsForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement | null>(null)

  type CurrencyCode =
    | "USD"
    | "EUR"
    | "GBP"
    | "INR"
    | "CAD"
    | "AUD"
    | "JPY"
    | "CHF"
    | "SEK"
    | "NOK"
    | "BRL"
    | "MXN"
    | "ZAR"
    | "AED"
    | "SGD"

  // Comprehensive currency symbol mapping for all countries
  const COUNTRY_CURRENCY_SYMBOLS: Record<string, string> = {
    "Afghanistan": "؋",
    "Albania": "L",
    "Algeria": "دج",
    "Andorra": "€",
    "Angola": "Kz",
    "Antigua and Barbuda": "EC$",
    "Argentina": "$",
    "Armenia": "֏",
    "Australia": "A$",
    "Austria": "€",
    "Azerbaijan": "₼",
    "Bahamas": "B$",
    "Bahrain": ".د.ب",
    "Bangladesh": "৳",
    "Barbados": "Bds$",
    "Belarus": "Br",
    "Belgium": "€",
    "Belize": "BZ$",
    "Benin": "CFA",
    "Bhutan": "Nu.",
    "Bolivia": "Bs.",
    "Bosnia and Herzegovina": "KM",
    "Botswana": "P",
    "Brazil": "R$",
    "Brunei": "B$",
    "Bulgaria": "лв",
    "Burkina Faso": "CFA",
    "Burundi": "FBu",
    "Cabo Verde": "Esc",
    "Cambodia": "៛",
    "Cameroon": "CFA",
    "Canada": "C$",
    "Central African Republic": "CFA",
    "Chad": "CFA",
    "Chile": "$",
    "China": "¥",
    "Colombia": "$",
    "Comoros": "CF",
    "Congo (Democratic Republic)": "FC",
    "Congo (Republic)": "CFA",
    "Costa Rica": "₡",
    "Croatia": "€",
    "Cuba": "₱",
    "Cyprus": "€",
    "Czech Republic": "Kč",
    "Denmark": "kr",
    "Djibouti": "Fdj",
    "Dominica": "EC$",
    "Dominican Republic": "RD$",
    "Ecuador": "$",
    "Egypt": "E£",
    "El Salvador": "$",
    "Equatorial Guinea": "CFA",
    "Eritrea": "Nfk",
    "Estonia": "€",
    "Eswatini": "E",
    "Ethiopia": "Br",
    "Fiji": "FJ$",
    "Finland": "€",
    "France": "€",
    "Gabon": "CFA",
    "Gambia": "D",
    "Georgia": "₾",
    "Germany": "€",
    "Ghana": "₵",
    "Greece": "€",
    "Grenada": "EC$",
    "Guatemala": "Q",
    "Guinea": "FG",
    "Guinea-Bissau": "CFA",
    "Guyana": "GY$",
    "Haiti": "G",
    "Honduras": "L",
    "Hungary": "Ft",
    "Iceland": "kr",
    "India": "₹",
    "Indonesia": "Rp",
    "Iran": "﷼",
    "Iraq": "ع.د",
    "Ireland": "€",
    "Israel": "₪",
    "Italy": "€",
    "Jamaica": "J$",
    "Japan": "¥",
    "Jordan": "JD",
    "Kazakhstan": "₸",
    "Kenya": "KSh",
    "Kiribati": "A$",
    "Kuwait": "KD",
    "Kyrgyzstan": "с",
    "Laos": "₭",
    "Latvia": "€",
    "Lebanon": "ل.ل",
    "Lesotho": "L",
    "Liberia": "L$",
    "Libya": "ل.د",
    "Liechtenstein": "CHF",
    "Lithuania": "€",
    "Luxembourg": "€",
    "Madagascar": "Ar",
    "Malawi": "MK",
    "Malaysia": "RM",
    "Maldives": "Rf",
    "Mali": "CFA",
    "Malta": "€",
    "Marshall Islands": "$",
    "Mauritania": "UM",
    "Mauritius": "₨",
    "Mexico": "Mex$",
    "Micronesia": "$",
    "Moldova": "L",
    "Monaco": "€",
    "Mongolia": "₮",
    "Montenegro": "€",
    "Morocco": "MAD",
    "Mozambique": "MTn",
    "Myanmar": "K",
    "Namibia": "N$",
    "Nauru": "A$",
    "Nepal": "₨",
    "Netherlands": "€",
    "New Zealand": "NZ$",
    "Nicaragua": "C$",
    "Niger": "CFA",
    "Nigeria": "₦",
    "North Korea": "₩",
    "North Macedonia": "ден",
    "Norway": "kr",
    "Oman": "﷼",
    "Pakistan": "₨",
    "Palau": "$",
    "Palestine": "₪",
    "Panama": "$",
    "Papua New Guinea": "K",
    "Paraguay": "₲",
    "Peru": "S/.",
    "Philippines": "₱",
    "Poland": "zł",
    "Portugal": "€",
    "Qatar": "﷼",
    "Romania": "lei",
    "Russia": "₽",
    "Rwanda": "FRw",
    "Saint Kitts and Nevis": "EC$",
    "Saint Lucia": "EC$",
    "Saint Vincent and the Grenadines": "EC$",
    "Samoa": "WS$",
    "San Marino": "€",
    "São Tomé and Príncipe": "Db",
    "Saudi Arabia": "﷼",
    "Senegal": "CFA",
    "Serbia": "дин",
    "Seychelles": "₨",
    "Sierra Leone": "Le",
    "Singapore": "S$",
    "Slovakia": "€",
    "Slovenia": "€",
    "Solomon Islands": "SI$",
    "Somalia": "Sh.So.",
    "South Africa": "R",
    "South Korea": "₩",
    "South Sudan": "£ss",
    "Spain": "€",
    "Sri Lanka": "Rs",
    "Sudan": "ج.س",
    "Suriname": "SRD",
    "Sweden": "kr",
    "Switzerland": "CHF",
    "Syria": "£S",
    "Taiwan": "NT$",
    "Tajikistan": "SM",
    "Tanzania": "TSh",
    "Thailand": "฿",
    "Timor-Leste": "$",
    "Togo": "CFA",
    "Tonga": "T$",
    "Trinidad and Tobago": "TT$",
    "Tunisia": "DT",
    "Turkey": "₺",
    "Turkmenistan": "T",
    "Tuvalu": "A$",
    "Uganda": "USh",
    "Ukraine": "₴",
    "United Arab Emirates": "د.إ",
    "United Kingdom": "£",
    "United States": "$",
    "Uruguay": "$U",
    "Uzbekistan": "лв",
    "Vanuatu": "VT",
    "Vatican City": "€",
    "Venezuela": "Bs.S",
    "Vietnam": "₫",
    "Yemen": "﷼",
    "Zambia": "ZK",
    "Zimbabwe": "Z$"
  }

  const CURRENCY_SYMBOL: Record<CurrencyCode | "DEFAULT", string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    CAD: "C$",
    AUD: "A$",
    JPY: "¥",
    CHF: "CHF",
    SEK: "SEK",
    NOK: "NOK",
    BRL: "R$",
    MXN: "$",
    ZAR: "R",
    AED: "AED",
    SGD: "S$",
    DEFAULT: "$",
  }

  const BUDGET_BY_CURRENCY: Partial<Record<CurrencyCode, { value: string; label: string }[]>> = {
    USD: [
      { value: "$5K-10K", label: "$5K-10K" },
      { value: "$10K-25K", label: "$10K-25K" },
      { value: "$25K-50K", label: "$25K-50K" },
      { value: "$50K-100K", label: "$50K-100K" },
      { value: "$100K+", label: "$100K+" },
    ],
    EUR: [
      { value: "€4K-8K", label: "€4K-8K" },
      { value: "€8K-20K", label: "€8K-20K" },
      { value: "€20K-40K", label: "€20K-40K" },
      { value: "€40K-80K", label: "€40K-80K" },
      { value: "€80K+", label: "€80K+" },
    ],
    GBP: [
      { value: "£4K-8K", label: "£4K-8K" },
      { value: "£8K-20K", label: "£8K-20K" },
      { value: "£20K-40K", label: "£20K-40K" },
      { value: "£40K-80K", label: "£40K-80K" },
      { value: "£80K+", label: "£80K+" },
    ],
    INR: [
      { value: "₹4L-8L", label: "₹4L-8L" },
      { value: "₹8L-20L", label: "₹8L-20L" },
      { value: "₹20L-40L", label: "₹20L-40L" },
      { value: "₹40L-80L", label: "₹40L-80L" },
      { value: "₹80L+", label: "₹80L+" },
    ],
    CAD: [
      { value: "C$6K-12K", label: "C$6K-12K" },
      { value: "C$12K-30K", label: "C$12K-30K" },
      { value: "C$30K-60K", label: "C$30K-60K" },
      { value: "C$60K-120K", label: "C$60K-120K" },
      { value: "C$120K+", label: "C$120K+" },
    ],
    AUD: [
      { value: "A$7K-14K", label: "A$7K-14K" },
      { value: "A$14K-35K", label: "A$14K-35K" },
      { value: "A$35K-70K", label: "A$35K-70K" },
      { value: "A$70K-140K", label: "A$70K-140K" },
      { value: "A$140K+", label: "A$140K+" },
    ],
    JPY: [
      { value: "¥500K-1M", label: "¥500K-1M" },
      { value: "¥1M-2.5M", label: "¥1M-2.5M" },
      { value: "¥2.5M-5M", label: "¥2.5M-5M" },
      { value: "¥5M-10M", label: "¥5M-10M" },
      { value: "¥10M+", label: "¥10M+" },
    ],
    CHF: [
      { value: "CHF5K-10K", label: "CHF5K-10K" },
      { value: "CHF10K-25K", label: "CHF10K-25K" },
      { value: "CHF25K-50K", label: "CHF25K-50K" },
      { value: "CHF50K-100K", label: "CHF50K-100K" },
      { value: "CHF100K+", label: "CHF100K+" },
    ],
    SEK: [
      { value: "50K-100K SEK", label: "50K-100K SEK" },
      { value: "100K-250K SEK", label: "100K-250K SEK" },
      { value: "250K-500K SEK", label: "250K-500K SEK" },
      { value: "500K-1M SEK", label: "500K-1M SEK" },
      { value: "1M+ SEK", label: "1M+ SEK" },
    ],
    NOK: [
      { value: "50K-100K NOK", label: "50K-100K NOK" },
      { value: "100K-250K NOK", label: "100K-250K NOK" },
      { value: "250K-500K NOK", label: "250K-500K NOK" },
      { value: "500K-1M NOK", label: "500K-1M NOK" },
      { value: "1M+ NOK", label: "1M+ NOK" },
    ],
    BRL: [
      { value: "R$25K-50K", label: "R$25K-50K" },
      { value: "R$50K-125K", label: "R$50K-125K" },
      { value: "R$125K-250K", label: "R$125K-250K" },
      { value: "R$250K-500K", label: "R$250K-500K" },
      { value: "R$500K+", label: "R$500K+" },
    ],
    MXN: [
      { value: "$100K-200K MXN", label: "$100K-200K MXN" },
      { value: "$200K-500K MXN", label: "$200K-500K MXN" },
      { value: "$500K-1M MXN", label: "$500K-1M MXN" },
      { value: "$1M-2M MXN", label: "$1M-2M MXN" },
      { value: "$2M+ MXN", label: "$2M+ MXN" },
    ],
    ZAR: [
      { value: "R80K-160K", label: "R80K-160K" },
      { value: "R160K-400K", label: "R160K-400K" },
      { value: "R400K-800K", label: "R400K-800K" },
      { value: "R800K-1.6M", label: "R800K-1.6M" },
      { value: "R1.6M+", label: "R1.6M+" },
    ],
    AED: [
      { value: "18K-36K AED", label: "18K-36K AED" },
      { value: "36K-90K AED", label: "36K-90K AED" },
      { value: "90K-180K AED", label: "90K-180K AED" },
      { value: "180K-360K AED", label: "180K-360K AED" },
      { value: "360K+ AED", label: "360K+ AED" },
    ],
    SGD: [
      { value: "S$6K-12K", label: "S$6K-12K" },
      { value: "S$12K-30K", label: "S$12K-30K" },
      { value: "S$30K-60K", label: "S$30K-60K" },
      { value: "S$60K-120K", label: "S$60K-120K" },
      { value: "S$120K+", label: "S$120K+" },
    ],
  }

  const FORCE_USD_COUNTRIES = new Set<string>(["US", "EC", "SV"])

  type CountryOption = {
    code: string // ISO 3166-1 alpha-2
    name: string
    altNames: string[]
    currencyCode: CurrencyCode | "DEFAULT"
  }

  const allCountries: CountryOption[] = useMemo(() => {
    const items: CountryOption[] = countriesData
      .map((c) => {
        const code = (c.cca2 || "").toUpperCase()
        const name = c.name?.common || code
        const alt = (c.altSpellings || []).filter(Boolean) as string[]
        let currencyCode: CurrencyCode | "DEFAULT" = "DEFAULT"
        const currCodes = c.currencies ? Object.keys(c.currencies) : []
        if (FORCE_USD_COUNTRIES.has(code)) {
          currencyCode = "USD"
        } else if (currCodes.length > 0) {
          const cc = currCodes[0] as CurrencyCode
          currencyCode = (
            [
              "USD",
              "EUR",
              "GBP",
              "INR",
              "CAD",
              "AUD",
              "JPY",
              "CHF",
              "SEK",
              "NOK",
              "BRL",
              "MXN",
              "ZAR",
              "AED",
              "SGD",
            ] as const
          ).includes(cc)
            ? cc
            : "DEFAULT"
        }
        const aliases: string[] = []
        if (code === "US") aliases.push("USA", "United States")
        if (code === "GB") aliases.push("UK", "United Kingdom")
        if (code === "AE") aliases.push("UAE")
        return { code, name, altNames: Array.from(new Set([name, ...alt, ...aliases])), currencyCode }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [])

  const [countryCode, setCountryCode] = useState<string>("US")
  const [countryName, setCountryName] = useState<string>("United States")
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode | "DEFAULT">("USD")
  const [budget, setBudget] = useState<string>("")
  const [customBudgetMin, setCustomBudgetMin] = useState<string>("")
  const [customBudgetMax, setCustomBudgetMax] = useState<string>("")
  const [budgetValidationError, setBudgetValidationError] = useState<string>("")
  const [timeline, setTimeline] = useState<string>("4 weeks")
  const [industryType, setIndustryType] = useState<string>("")
  const [customIndustry, setCustomIndustry] = useState<string>("")
  const [objectives, setObjectives] = useState<string[]>([])
  const [customObjectives, setCustomObjectives] = useState<string[]>([])
  const [showCustomObjective, setShowCustomObjective] = useState<boolean>(false)
  const [customObjectiveInput, setCustomObjectiveInput] = useState<string>("")
  const [countryOpen, setCountryOpen] = useState(false)
  const [currencyLoading, setCurrencyLoading] = useState(false)

  const [scenarioIndex, setScenarioIndex] = useState(0)
  const scenarios = useMemo(
    () => [
      {
        name: "E-commerce",
        values: {
          companyName: "TechCorp Solutions Ltd",
          projectTitle: "E-commerce Platform with Mobile App",
          clientName: "Sarah Johnson",
          clientCompany: "Retail Innovations Inc",
          clientEmail: "sarah.johnson@retailinnovations.com",
          projectDescription:
            "We need a comprehensive e-commerce platform with web and mobile applications. The solution should include inventory management, payment processing, customer analytics, and an admin dashboard. Integration with existing CRM and accounting systems is required.",
          countryCode: "US",
          countryName: "United States",
          budget: "$25K-50K",
          timeline: "4 weeks",
          industryType: "E-commerce & Retail",
          objectives: ["Improve User Experience", "Increase Conversion", "Reduce Operational Costs"],
        },
      },
      {
        name: "Mobile App",
        values: {
          companyName: "Nova Digital Labs",
          projectTitle: "Mobile App Development for On-Demand Services",
          clientName: "Daniel Kim",
          clientCompany: "QuickServe Technologies",
          clientEmail: "daniel.kim@quickserve.io",
          projectDescription:
            "Build a cross-platform mobile app (iOS/Android) with real-time booking, in-app payments, service provider dashboards, and analytics. Integrate with an existing REST API and third-party auth.",
          countryCode: "US",
          countryName: "United States",
          budget: "$10K-25K",
          timeline: "3 weeks",
          industryType: "Technology",
          objectives: ["Launch MVP Quickly", "Integrate Existing Systems", "Improve User Experience"],
        },
      },
    ],
    [],
  )

  // Get currency symbol from comprehensive country mapping, default to USD
  const currencySymbol = COUNTRY_CURRENCY_SYMBOLS[countryName] || CURRENCY_SYMBOL[currencyCode] || CURRENCY_SYMBOL.USD

  const detectFromLocale = () => {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale || navigator.language || "en-US"
      const match = locale.match(/[-_](\w{2})$/)
      const region = (match?.[1] || "").toUpperCase()
      if (!region) return { code: "US", name: "United States" }
      const found = allCountries.find((c) => c.code === region)
      return found ? { code: found.code, name: found.name } : { code: "US", name: "United States" }
    } catch {
      return { code: "US", name: "United States" }
    }
  }

  useEffect(() => {
    const storedCode = sessionStorage.getItem("brf_country_code")
    const storedName = sessionStorage.getItem("brf_country_name")
    if (storedCode && storedName) {
      const found = allCountries.find((c) => c.code === storedCode)
      if (found) {
        setCountryCode(storedCode)
        setCountryName(storedName)
        setCurrencyCode(found.currencyCode)
        return
      }
    }
    // Always default to USD and United States on initial load
    setCountryCode("US")
    setCountryName("United States")
    setCurrencyCode("USD")
  }, [])

  useEffect(() => {
    const opts = (currencyCode && BUDGET_BY_CURRENCY[currencyCode]) || BUDGET_BY_CURRENCY.USD
    if (opts && opts[1]) {
      setBudget(opts[1].value)
    } else {
      setBudget("")
    }
  }, [currencyCode])

  const budgetOptions = useMemo(() => {
    // Use comprehensive currency symbol for budget options, default to USD
    const symbol = COUNTRY_CURRENCY_SYMBOLS[countryName] || CURRENCY_SYMBOL[currencyCode] || CURRENCY_SYMBOL.USD
    
    // Generate budget options with the correct currency symbol
    const baseOptions = [
      { value: `${symbol}5K-10K`, label: `${symbol}5K-10K` },
      { value: `${symbol}10K-25K`, label: `${symbol}10K-25K` },
      { value: `${symbol}25K-50K`, label: `${symbol}25K-50K` },
      { value: `${symbol}50K-100K`, label: `${symbol}50K-100K` },
      { value: `${symbol}100K+`, label: `${symbol}100K+` },
      { value: "CUSTOM", label: "Enter your own range" },
    ]
    
    return baseOptions
  }, [countryName, currencyCode])

  // Weekly timeline options
  const timelineOptions = useMemo(() => {
    const options = []
    for (let i = 1; i <= 15; i++) {
      options.push({
        value: `${i} week${i === 1 ? '' : 's'}`,
        label: `${i} week${i === 1 ? '' : 's'}`
      })
    }
    return options
  }, [])

  const flagUrl = `https://flagcdn.com/${countryCode.toLowerCase()}.svg`

  // Validation for custom budget inputs
  const validateCustomBudget = (min: string, max: string) => {
    if (!min || !max) {
      setBudgetValidationError("")
      return true
    }
    
    const minNum = parseFloat(min)
    const maxNum = parseFloat(max)
    
    if (isNaN(minNum) || isNaN(maxNum)) {
      setBudgetValidationError("Please enter valid numbers")
      return false
    }
    
    if (minNum >= maxNum) {
      setBudgetValidationError("Minimum must be less than maximum")
      return false
    }
    
    setBudgetValidationError("")
    return true
  }

  // Handle custom budget input changes
  const handleCustomBudgetChange = (field: 'min' | 'max', value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '')
    
    if (field === 'min') {
      setCustomBudgetMin(sanitized)
      validateCustomBudget(sanitized, customBudgetMax)
    } else {
      setCustomBudgetMax(sanitized)
      validateCustomBudget(customBudgetMin, sanitized)
    }
  }

  // Handle budget selection
  const handleBudgetChange = (value: string) => {
    setBudget(value)
    if (value !== "CUSTOM") {
      setCustomBudgetMin("")
      setCustomBudgetMax("")
      setBudgetValidationError("")
    }
  }

  // Handle industry type selection
  const handleIndustryChange = (value: string) => {
    setIndustryType(value)
    if (value !== "Other") {
      setCustomIndustry("")
    }
  }

  // Handle objective selection
  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (objective === "Other") {
      setShowCustomObjective(checked)
      if (!checked) {
        setCustomObjectives([])
        setCustomObjectiveInput("")
      }
    } else {
      setObjectives(prev => 
        checked 
          ? [...prev, objective]
          : prev.filter(obj => obj !== objective)
      )
    }
  }

  // Handle adding custom objective
  const handleAddCustomObjective = () => {
    if (customObjectiveInput.trim()) {
      setCustomObjectives(prev => [...prev, customObjectiveInput.trim()])
      setCustomObjectiveInput("")
    }
  }

  // Handle removing custom objective
  const handleRemoveCustomObjective = (objective: string) => {
    setCustomObjectives(prev => prev.filter(obj => obj !== objective))
  }

  const handleCountrySelect = (nextCode: string) => {
    const found = allCountries.find((c) => c.code === nextCode)
    if (!found) return
    
    setCountryOpen(false)
    setCurrencyLoading(true)
    
    // Update country information immediately
    setCountryCode(found.code)
    setCountryName(found.name)
    
    // Update currency immediately
    const newCurrencyCode = found.currencyCode
    const oldCurrencyCode = currencyCode
    setCurrencyCode(newCurrencyCode)
    
    // Save to session storage
    sessionStorage.setItem("brf_country_code", found.code)
    sessionStorage.setItem("brf_country_name", found.name)
    
    // Reset budget selection when currency changes
    setBudget("")
    setCustomBudgetMin("")
    setCustomBudgetMax("")
    setBudgetValidationError("")
    
    // Show currency change notification if currency actually changed
    if (oldCurrencyCode !== newCurrencyCode) {
      const newSymbol = COUNTRY_CURRENCY_SYMBOLS[found.name] || CURRENCY_SYMBOL[newCurrencyCode] || CURRENCY_SYMBOL.DEFAULT
      toast({
        title: "Currency Updated",
        description: `Budget ranges now display in ${newCurrencyCode} ${newSymbol}`,
      })
    }
    
    // Brief loading state for smooth UX
    setTimeout(() => setCurrencyLoading(false), 200)
  }


  function dateMonthsFromNow(months: number): string {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  function highlight(el: HTMLElement) {
    el.classList.add("ring-2", "ring-blue-200", "bg-blue-50")
    setTimeout(() => {
      el.classList.remove("ring-2", "ring-blue-200", "bg-blue-50")
    }, 450)
  }

  function setInputValue(selector: string, value: string) {
    const el = formRef.current?.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null
    if (el) {
      el.value = value
      highlight(el)
      el.dispatchEvent(new Event("input", { bubbles: true }))
      el.dispatchEvent(new Event("change", { bubbles: true }))
    }
  }

  function setObjectivesFromTestData(values: string[]) {
    const boxes = Array.from(formRef.current?.querySelectorAll('input[name="objectives"]') || []) as HTMLInputElement[]
    boxes.forEach((box) => {
      box.checked = values.includes(box.value)
      const labelEl = box.parentElement as HTMLElement | null
      if (labelEl) highlight(labelEl)
    })
  }

  const fillTestData = () => {
    const s = scenarios[scenarioIndex]?.values
    if (!s) return

    let offset = 0
    const step = (fn: () => void, delay = 120) => {
      offset += delay
      setTimeout(fn, offset)
    }

    step(() => {
      handleCountrySelect(s.countryCode)
    }, 0)

    step(() => setInputValue("#companyName", s.companyName))
    step(() => setInputValue("#projectTitle", s.projectTitle))
    step(() => setInputValue("#clientName", s.clientName))
    step(() => setInputValue("#clientCompany", s.clientCompany))
    step(() => setInputValue("#clientEmail", s.clientEmail))
    step(() => setInputValue("#projectDescription", s.projectDescription), 180)

    step(() => {
      const desired = s.budget
      setBudget(desired)
      const el = formRef.current?.querySelector("#budgetRange") as HTMLSelectElement | null
      if (el) {
        el.value = desired
        highlight(el)
        el.dispatchEvent(new Event("change", { bubbles: true }))
      }
    }, 360)

    step(() => setTimeline(s.timeline))
    step(() => setIndustryType(s.industryType))
    step(() => {
      setObjectives(s.objectives)
      setCustomObjectives([])
      setShowCustomObjective(false)
      setCustomObjectiveInput("")
      setObjectivesFromTestData(s.objectives)
    }, 180)

    step(() => {
      toast({ title: "Test data loaded!", description: `Scenario: ${scenarios[scenarioIndex].name}` })
      setScenarioIndex((i) => (i + 1) % scenarios.length)
    }, 200)
  }

  const clearAll = () => {
    const fields = [
      "#companyName",
      "#projectTitle",
      "#clientName",
      "#clientCompany",
      "#clientEmail",
      "#projectDescription",
    ]
    fields.forEach((sel, i) =>
      setTimeout(() => {
        setInputValue(sel, "")
      }, i * 60),
    )

    setTimeout(() => {
      setObjectives([])
      setCustomObjectives([])
      setShowCustomObjective(false)
      setCustomObjectiveInput("")
    }, 100)

    setTimeout(() => {
      setIndustryType("")
      setCustomIndustry("")
    }, 120)

    setTimeout(() => {
      const det = detectFromLocale()
      handleCountrySelect(det.code || "US")
    }, 160)

    setTimeout(() => {
      setBudget("")
      setCustomBudgetMin("")
      setCustomBudgetMax("")
      setBudgetValidationError("")
      setTimeline("4 weeks")
      const el = formRef.current?.querySelector("#budgetRange") as HTMLSelectElement | null
      if (el) {
        el.value = ""
        highlight(el)
        el.dispatchEvent(new Event("change", { bubbles: true }))
      }
    }, 320)

    setTimeout(() => {
      toast({ title: "Cleared", description: "All fields have been reset." })
    }, 400)
  }

  useEffect(() => {
    const onFill = () => fillTestData()
    const onClear = () => clearAll()
    window.addEventListener("brf:fill-test-data", onFill)
    window.addEventListener("brf:clear-form", onClear)
    return () => {
      window.removeEventListener("brf:fill-test-data", onFill)
      window.removeEventListener("brf:clear-form", onClear)
    }
  }, [scenarioIndex])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Collect form data
      const formData = new FormData(e.currentTarget)
      const requirements = {
        companyName: formData.get('companyName') as string,
        projectTitle: formData.get('projectTitle') as string,
        clientName: formData.get('clientName') as string,
        clientCompany: formData.get('clientCompany') as string,
        clientEmail: formData.get('clientEmail') as string,
        projectDescription: formData.get('projectDescription') as string,
        countryCode,
        countryName,
        budgetRange: budget === "CUSTOM" ? `${currencySymbol}${customBudgetMin}-${currencySymbol}${customBudgetMax}` : budget,
        timeline: timeline,
        industryType: industryType === "Other" ? customIndustry : industryType,
        objectives: [...objectives, ...customObjectives]
      }

      // Validate custom budget if selected
      if (budget === "CUSTOM") {
        if (!customBudgetMin || !customBudgetMax) {
          toast({
            title: "Validation Error",
            description: "Please enter both minimum and maximum budget values",
            variant: "destructive"
          })
          setSubmitting(false)
          return
        }
        
        if (budgetValidationError) {
          toast({
            title: "Validation Error",
            description: budgetValidationError,
            variant: "destructive"
          })
          setSubmitting(false)
          return
        }
      }

      // Validate custom industry if selected
      if (industryType === "Other") {
        if (!customIndustry.trim()) {
          toast({
            title: "Validation Error",
            description: "Please enter your industry type",
            variant: "destructive"
          })
          setSubmitting(false)
          return
        }
      }

      // Validate required fields
      const requiredFields = ['companyName', 'projectTitle', 'clientName', 'projectDescription', 'budgetRange', 'timeline', 'industryType']
      const missingFields = requiredFields.filter(field => !requirements[field as keyof typeof requirements])
      
      if (missingFields.length > 0) {
        toast({
          title: "Validation Error",
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
          variant: "destructive"
        })
        setSubmitting(false)
        return
      }

      // Call API to process requirements and generate executive summary
      const response = await fetch('/api/process-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requirements),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process requirements')
      }

      const result = await response.json()
      
      // Store the proposal data in localStorage
      localStorage.setItem('currentProposal', JSON.stringify(result.data))
      
      // Show success message
      toast({ 
        title: "Success!", 
        description: "Requirements submitted and sections generated successfully." 
      })

      // Navigate to content index
      router.push("/content-index")
    } catch (error) {
      console.error('Error submitting requirements:', error)
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to submit requirements. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative space-y-6 font-sans">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
            Company Name
          </label>
          <input
            id="companyName"
            name="companyName"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Acme Corp"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="projectTitle" className="text-sm font-medium text-slate-700">
            Project Title
          </label>
          <input
            id="projectTitle"
            name="projectTitle"
            required
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="New Website Redesign"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </section>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-medium text-slate-700">Client Information</legend>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="clientName" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="clientName"
              name="clientName"
              required
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Jane Doe"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="clientCompany" className="text-sm font-medium text-slate-700">
              Company
            </label>
            <input
              id="clientCompany"
              name="clientCompany"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Client Co."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="clientEmail" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="jane@example.com"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="projectDescription" className="text-sm font-medium text-slate-700">
          Project Description
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          required
          rows={5}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Describe the project goals, audience, and scope."
        />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="country" className="text-sm font-medium text-slate-700">
              Country
            </label>
            <img
              src={flagUrl || "/placeholder.svg"}
              alt={`${countryName} flag`}
              width={24}
              height={16}
              className="h-4 w-6 rounded-sm border border-slate-200"
            />
          </div>
          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
                aria-label="Select country"
              >
                <span className="flex items-center gap-2">
                  <img
                    src={flagUrl || "/placeholder.svg"}
                    alt=""
                    width={16}
                    height={12}
                    className="h-3.5 w-5 rounded-sm border border-slate-200"
                  />
                  <span className="truncate">{countryName}</span>
                </span>
                <span className="text-slate-400">Change</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(560px,90vw)] p-0">
              <Command
                filter={(value, search) => {
                  if (!search) return 1
                  const v = value.toLowerCase()
                  const s = search.toLowerCase()
                  return v.includes(s) ? 1 : 0
                }}
              >
                <CommandInput placeholder="Search countries (try 'USA', 'UK', 'UAE')..." />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {allCountries.map((c) => (
                      <CommandItem
                        key={c.code}
                        value={`${c.name} ${c.altNames.join(" ")}`}
                        onSelect={() => handleCountrySelect(c.code)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://flagcdn.com/${c.code.toLowerCase()}.svg`}
                            alt=""
                            width={18}
                            height={12}
                            className="h-3.5 w-5 rounded-sm border border-slate-200"
                          />
                          <span>{c.name}</span>
                          <span className="ml-2 text-xs text-slate-500">{c.code}</span>
                          <span className="ml-auto text-xs text-slate-400">
                            {CURRENCY_SYMBOL[c.currencyCode === "DEFAULT" ? "USD" : c.currencyCode]} {c.currencyCode === "DEFAULT" ? "USD" : c.currencyCode}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="budgetRange" className="text-sm font-medium text-slate-700">
              Budget Range
            </label>
            <div className="flex items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                currencyLoading 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-blue-50 text-blue-700"
              }`}>
                {currencyCode} {currencySymbol}
              </span>
              {currencyLoading && (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              )}
            </div>
          </div>
          <div className={currencyLoading ? "opacity-50 transition-opacity" : "transition-opacity"}>
            <select
              id="budgetRange"
              name="budgetRange"
              required
              value={budget}
              onChange={(e) => handleBudgetChange(e.target.value)}
              disabled={currencyLoading}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50"
            >
              <option value="">Select a budget</option>
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Budget Input Fields */}
          {budget === "CUSTOM" && (
            <div className="mt-3 space-y-3 p-4 bg-slate-50 rounded-md border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-700">Custom Budget Range</span>
                <span className="text-xs text-slate-500">({currencySymbol})</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="customBudgetMin" className="block text-xs font-medium text-slate-600 mb-1">
                    Minimum Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      id="customBudgetMin"
                      value={customBudgetMin}
                      onChange={(e) => handleCustomBudgetChange('min', e.target.value)}
                      placeholder="Enter minimum"
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="customBudgetMax" className="block text-xs font-medium text-slate-600 mb-1">
                    Maximum Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      id="customBudgetMax"
                      value={customBudgetMax}
                      onChange={(e) => handleCustomBudgetChange('max', e.target.value)}
                      placeholder="Enter maximum"
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              {budgetValidationError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  {budgetValidationError}
                </div>
              )}
              
              {customBudgetMin && customBudgetMax && !budgetValidationError && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                  ✓ Custom range: {currencySymbol}{customBudgetMin} - {currencySymbol}{customBudgetMax}
                </div>
              )}
            </div>
          )}
          
          {currencyLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Updating currency ranges...
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="timeline" className="text-sm font-medium text-slate-700">
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select timeline</option>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-3">
          <label htmlFor="industryType" className="text-sm font-medium text-slate-700">
            Industry Type
          </label>
          <select
            id="industryType"
            name="industryType"
            required
            value={industryType}
            onChange={(e) => handleIndustryChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select an industry</option>
            <option>E-commerce & Retail</option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>Retail</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          {/* Custom Industry Input Field */}
          {industryType === "Other" && (
            <div className="mt-2">
              <label htmlFor="customIndustry" className="block text-sm font-medium text-slate-700 mb-1">
                Specify Industry Type
              </label>
              <input
                type="text"
                id="customIndustry"
                name="customIndustry"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                placeholder="Enter your industry type"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </section>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">Key Objectives</legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Improve User Experience",
            "Increase Conversion",
            "Reduce Operational Costs",
            "Launch MVP Quickly",
            "Integrate Existing Systems",
            "Enhance Brand Presence",
            "Other",
          ].map((label) => (
            <label
              key={label}
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-blue-600"
            >
              <input 
                type="checkbox" 
                name="objectives" 
                value={label} 
                className="h-4 w-4 accent-blue-600"
                checked={label === "Other" ? showCustomObjective : objectives.includes(label)}
                onChange={(e) => handleObjectiveChange(label, e.target.checked)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Custom Objectives Section */}
        {showCustomObjective && (
          <div className="mt-4 p-4 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-slate-700">Add Custom Objectives</span>
            </div>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customObjectiveInput}
                onChange={(e) => setCustomObjectiveInput(e.target.value)}
                placeholder="Enter your key objective"
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomObjective()}
              />
              <button
                type="button"
                onClick={handleAddCustomObjective}
                disabled={!customObjectiveInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {/* Display custom objectives */}
            {customObjectives.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-600">Custom Objectives:</span>
                {customObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-3 py-2">
                    <span className="text-sm text-slate-700">{objective}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomObjective(objective)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </fieldset>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Generating Executive Summary...
            </span>
          ) : (
            "Submit & Continue"
          )}
        </button>
      </div>
    </form>
  )
}
