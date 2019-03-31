<template>
  <q-page class="docs-input row justify-center" v-touch-swipe.mouse.left.right="swipe">
    <div style="width: 500px; max-width: 90vw;">
      <q-field
        class="full-width q-my-md"
      >
        <q-input 
        id="km_actual"
        type="tel" label="Actual Car KM..." v-model="form.km_actual" />
      </q-field>

      <q-field
        class="full-width q-my-md"
      >
        <q-input 
        type="tel" label="Fuel lts add..." v-money="lts" v-model="form.lts_add" id="lts_add" />
      </q-field>

      <q-field
        class="full-width q-my-md"
      >
        <q-input 
        type="tel" label="Price..."  v-money="lts" v-model="form.price" id="price" />
      </q-field>

      <q-field
          class="full-width q-my-md"
      >
        <q-input 
          label="Total:" readonly v-model="form.total" id="total" />
      </q-field>

      <q-field>
        <q-input 
          filled 
          class="full-width q-my-md"
          :value="form.date" 
          @click.prevent="showDate = true"
          @keydown.prevent
          label="When"
        >
          <template v-slot:append>
            <q-icon name="event" >
              <q-popup-proxy :value="showDate" @hide="showDate = false">
                <q-date v-model="dateComputed"  minimal/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-field>

      <q-field>
        <q-btn 
          :label="index != undefined ? 'Save!' : 'Create!'" 
          class="full-width" 
          :color="isNight ? 'dark' : 'primary'" 
          @click="submit" 
          id="save-btn"
        />
      </q-field>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'

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
      console.log("ae")
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
      if(this.index != undefined){
        await this.$store.dispatch('fuel/update', {form: this.form, index: this.index})

      } else {
        await this.$store.dispatch('fuel/save', this.form)
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

    isNight(){
      var now = new Date();
      var formated = parseInt(date.formatDate(now, 'H'))
      return (formated > 18 || formated < 7 )
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