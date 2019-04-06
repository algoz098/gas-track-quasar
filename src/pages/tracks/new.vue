<template>
  <q-page class="docs-input row justify-center" v-touch-swipe.mouse.left="swipe">
    <div style="width: 500px; max-width: 90vw;">
      <q-field
        :dark="isNight"
        class="full-width q-my-md"
      >
        <q-input 
        id="km_actual"
        type="tel" label="Actual Car KM..." v-model="form.km_actual" />
      </q-field>

      <q-field
        :dark="isNight"
        class="full-width q-my-md"
      >
        <q-input 
        type="tel" label="Fuel lts add..." v-money="lts" v-model="form.lts_add" id="lts_add" />
      </q-field>

      <q-field
        :dark="isNight"
        class="full-width q-my-md"
      >
        <q-input 
        type="tel" label="Price..."  v-money="lts" v-model="form.price" id="price" />
      </q-field>

      <q-field
        :dark="isNight"
        class="full-width q-my-md"
      >
        <q-popup-edit 
          :class="isNight ? 'bg-blue-grey-10' : ''" 
          title="Be carefull, this will override the calculation"
          v-model="form.total"
          buttons
        >
          <q-input 
            type="tel"
            v-model="form.total" 
            v-money="lts" 
            dense 
            autofocus 
          />
        </q-popup-edit>

        <q-input 
          label="Total:" readonly v-model="form.total" id="total" />
      </q-field>

      <q-field
        class="q-my-md"
        :dark="isNight"
      >
        <q-input 
          filled 
          class="full-width "
          :value="form.date" 
          @click.prevent="showDate = true"
          @keydown.prevent
          label="When"
        >
          <template v-slot:append>
            <q-icon name="event" >
              <q-popup-proxy :value="showDate" @hide="showDate = false">
                <q-date v-model="dateComputed"
                  :dark="isNight"
                  minimal/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-field>

      <q-field>
        <q-btn 
          :label="index != undefined ? 'Save!' : 'Create!'" 
          class="full-width" 
          :color="isNight ? 'blue-grey-10' : 'primary'" 
          @click="submit" 
          id="save-btn"
        />
      </q-field>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
import {  LocalStorage as $ls } from 'quasar'

export default {
  name: 'tracks-new',

  data(){
    return{
      form:{
        id: null,
        saved: null,
        km_actual: '',
        lts_add: '',
        price: '',
        date: new Date(),
        total: '0.00',
        km_lt: '',
        wheeled: '',
      },

      showDate: false,
      
      lts: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      }
    }
  },

  watch: {
    'form.lts_add': 'calcTotal',
    'form.price': 'calcTotal',
  },

  created(){
      if (this.index != undefined){
        this.form.km_actual   = this.fuels[this.index].km_actual
        this.form.lts_add     = this.fuels[this.index].lts_add
        this.form.price       = this.fuels[this.index].price
        this.form.date        = this.fuels[this.index].date
        this.form.total       = this.fuels[this.index].total
        this.form.km_lt       = this.fuels[this.index].km_lt
        this.form.wheeled     = this.fuels[this.index].wheeled
        this.form.id     = this.fuels[this.index].id
      } else {
        this.load()
      }
  },

  methods:{
    swipe(){
      this.$router.push('/')
    },

    load(){
      if(!this.fuels || !this.fuels.length) return 

      if(this.fuels.length >= 2){
        var last_wheeled    = this.fuels[this.fuels.length - 2].wheeled
        
        if(last_wheeled){
          this.form.km_actual = parseFloat(parseFloat(this.fuels[this.fuels.length - 1].km_actual) + parseFloat(last_wheeled))
        }
      }
      
      if(this.fuels.length){
        this.form.lts_add     = this.fuels[this.fuels.length - 1].lts_add
        this.form.price       = this.fuels[this.fuels.length - 1].price
      }
    },

    calcTotal(){
      var lts = parseFloat(this.form.lts_add.replace('.', '').replace(',', '.'))
      var price = parseFloat(this.form.price.replace('.', '').replace(',', '.'))

      if(!lts || !price) {
        this.form.total = null
        return
      }

      this.form.total = lts * price
      this.numberFormat('total')
    },

    numberFormat(target){
      var data = this.form[target]

      if(!data){
        this.form[target] = '0.00'
        return
      }

      data = parseFloat(data).toFixed(2)
      data = data.toString()
      this.form[target] = data.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },

    async submit(){
      // if(this.fuels && this.fuels.length && this.fuels[this.fuels.length - 1]){
        // let index = this.fuels.findIndex(e => e == this.fuel)
        // console.log(index)
      //   var index = this.fuels.length - 1

      //   if(this.index) index = this.index - 1

      //   var copy = JSON.parse(JSON.stringify(this.fuels))

      //   copy[index].saved = null
      //   copy[index].wheeled = parseFloat((parseFloat(this.form.km_actual) - parseFloat(copy[index].km_actual)).toFixed(2))
      //   copy[index].km_lt = parseFloat((copy[index].wheeled / parseFloat(this.form.lts_add.replace(',', '.'))).toFixed(2))
        
      //   await $ls.set('fuels', JSON.stringify(copy))
        
      //   this.$store.commit('fuel/set', copy)
      // }


      if(this.index != undefined){
        await this.$store.dispatch('fuel/update', {form: this.form, index: this.index})
        await this.$store.dispatch('fuel/calcWheeled', {index: this.index})

      } else {
        await this.$store.dispatch('fuel/save', this.form)
        await this.$store.dispatch('fuel/calcWheeled', {index: this.fuels.length - 2})
      }

      this.$router.push('/')
    }
  },

  computed:{
    dateComputed:{
      get(){
        return date.formatDate(this.form.date, 'YYYY/MM/DD')
      },

      set(e){
        var data = new Date(e)
        this.form.date = data
      }
    },

    fuels(){
      return this.$store.state.fuel.data
    },

    index(){
      return this.$route.query.index
    }
  }
}
</script>