<template>
  <div class="mortgage-calculator cards-container row d-flex wrap align--start">
    <div class="flex xs12 sm12 md12 lg6">
      <va-card :title="$t('cards.title.mortgage')">
        <template slot="actions">
          <va-button
            icon="va-icon entypo entypo-chart-pie"
            @click="calculateMortgage"
          >Calculate</va-button>
        </template>
        <form>
          <!-- PURCHASE -->
          <div class="row">
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="purchasePrice"
                placeholder="0.00"
                label="Purchase Price"
                type="number"
              >
                <p slot="prepend">$</p>
              </va-input>
            </div>
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="downPaymentPercentage"
                placeholder="0"
                label="Down Payment Percentage"
                type="number"
              >
                <p slot="append">%</p>
              </va-input>
            </div>
          </div>

          <!-- MORTGAGE -->
          <div class="row">
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="interestRate"
                placeholder="0"
                label="Interest Rate"
                type="number"
              >
                <p slot="append">%</p>
              </va-input>
            </div>
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="loanTerm"
                placeholder="0"
                label="Loan Amortization Term"
                type="number"
              >
                <p slot="append">mo</p>
              </va-input>
            </div>
          </div>

          <!-- EXTRAS -->
          <div class="row">
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="propertyTaxes"
                placeholder="0.00"
                label="Property Taxes"
                type="number"
              >
                <p slot="prepend">$</p>
              </va-input>
            </div>
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="homeInsuranceAnnual"
                placeholder="0"
                label="Home Insurance"
                type="number"
              >
                <p slot="prepend">$</p>
                <p slot="append">/yr</p>
              </va-input>
            </div>
            <div class="flex md12 sm12 xs12">
              <va-input
                v-model.number="hoaDues"
                placeholder="0"
                label="HOA Dues"
                type="number"
              >
                <p slot="prepend">$</p>
                <p slot="append">/mo</p>
              </va-input>
            </div>
          </div>
          <div class="row">
            <div class="flex md12 sm12 xs12">
              <label>Utilities</label>

              <div class="row"
                v-for="(utility, index) in utilities"
                :key="utility.id"
              >
                <div class="flex lg5 md12 sm12 xs12">
                  <va-input
                    v-model="utility.name"
                    placeholder="Utility name"
                    label="Name"
                    type="text"
                  />
                </div>
                <div class="flex lg3 md8 sm8 xs8">
                  <va-input
                    v-model="utility.cost"
                    placeholder="0"
                    label="Cost"
                    type="number"
                  >
                    <p slot="prepend">$</p>
                  </va-input>
                </div>
                <div class="flex lg2 md2 sm2 xs2">
                  <va-button
                    v-if="moreThanOneUtility"
                    @click="() => removeUtility(utility.id)"
                    flat
                  >
                    <va-icon name="ion-md-close ion"/>
                  </va-button>
                </div>
                <div class="flex lg2 md2 sm2 xs2">
                  <va-button
                    v-if="index === utilities.length - 1"
                    @click="addUtility"
                    class="flex-end"
                    flat
                  >
                    <va-icon name="ion-md-add ion"/>
                  </va-button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </va-card>
    </div>
    <div class="flex xs12 sm12 md12 lg6">
      <va-card :title="$t('cards.title.result')">
        <va-chart :data="chartData" type="donut"/>
      </va-card>
    </div>
  </div>
</template>

<script>
import { mapCalculateMortgageRequest, mapCalculateMortgageResponse } from '@/mappers/calculators/mortgage'
import { MortgageCalculatorService } from '@/services/calculators/mortgage'

import { getDonutChartData } from '@/data/charts/DonutChartData.js'

import VaChart from '@/components/statistics/charts/va-charts/VaChart.vue'

export default {
  name: 'MortgageCalculator',
  components: {
    VaChart
  },
  mixins: [],
  props: {},
  data: () => ({
    chartConfig: [
      { key: 'associationDues', color: '#F49097' },
      { key: 'homeInsurance', color: '#DFB2F4' },
      { key: 'mortgage', color: '#F5E960' },
      { key: 'propertyTaxes', color: '#F2F5FF' },
      { key: 'utilitiesCost', color: '#55D6C2' }
    ],
    chartData: null,
    purchasePrice: 0,
    downPaymentPercentage: 0,
    interestRate: 0,
    loanTerm: 0,
    propertyTaxes: 0,
    homeInsuranceAnnual: 0,
    hoaDues: 0,
    utilities: [
      { id: 0, name: '', cost: 0 }
    ],
    utilityId: 0,
    results: null
  }),
  created () {
    this.chartData = {
      labels: [],
      datasets: [{
        label: 'Mortgage Result',
        backgroundColor: [],
        data: [],
      }],
    }
  },
  mounted () {},
  updated () {},
  destroyed () {},
  watch: {},
  computed: {
    moreThanOneUtility () {
      return this.utilities.length > 1
    }
  },
  methods: {
    addUtility () {
      this.utilities.push({ id: ++this.utilityId, name: '', cost: 0 })
    },
    removeUtility (id) {
      if (!this.moreThanOneUtility) return
      this.utilities.splice(this.utilities.findIndex(u => u.id == id), 1)
    },
    updateUtilityName (id, name) {
      const utilityIndex = this.utilities.findIndex(u => u.id == id)
      const utility = this.utilities[utilityIndex]
      utility.name = name
      this.utilities.splice(utilityIndex, 1, utility)
    },
    updateUtilityCost (id, cost) {
      const utilityIndex = this.utilities.findIndex(u => u.id == id)
      const utility = this.utilities[utilityIndex]
      utility.cost = cost
      this.utilities.splice(utilityIndex, 1, utility)
    },
    async calculateMortgage () {
      const request = {
        purchasePrice: this.purchasePrice,
        downPaymentPercentage: this.downPaymentPercentage,
        interestRate: this.interestRate,
        loanTerm: this.loanTerm,
        propertyTaxes: this.propertyTaxes,
        homeInsuranceAnnual: this.homeInsuranceAnnual,
        hoaDues: this.hoaDues,
        utilities: this.utilities
      }
      try {
        const res = await MortgageCalculatorService.calculate(mapCalculateMortgageRequest(request))
        const mapped = mapCalculateMortgageResponse(res.data.data)
        this.chartData = this.mapChartData(mapped)
      } catch (ex) {
        console.log(ex)
      }
    },
    mapChartData (res) {
      const labels = []
      const data = []
      const backgroundColor = []
      this.chartConfig.forEach(({ key, color }) => {
        labels.push(this.$t('charts.mortgage.' + key))
        data.push(res[key].toFixed(2))
        backgroundColor.push(color)
      })
      return {
        labels,
        datasets: [{
          label: 'Mortgage Result',
          backgroundColor,
          data,
        }],
      }
    }
  },
  directives: {},
  filters: {},
}
</script>

<style lang="scss">

</style>
