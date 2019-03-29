<template>
  <q-page class="flex flex-center" v-if="!fuels.length">
    <q-btn 
      :color="isNight ? 'dark' : 'primary'"
      label="CREATE FIRST TRACK" 
      to="/tracks/new"
    />
  </q-page>

  <q-page v-touch-swipe.left="swipe" v-else>
    <q-list highlight inset-separator>
      <q-list-header>Tracks</q-list-header>

      <q-item >
        <q-item-side>
            <q-item-main :label="`Spend: $${total_lts}`" :sublabel="`Wheeled: ${total_wheeled}km`" />
        </q-item-side>

        <q-item-side right>
            <q-item-main :label="`Effectness: ${total_effectness}km/lt`" />
        </q-item-side>
      </q-item>
      
      <q-item @click.native="action(index)" v-for="(item, index) in fuels" :key="index" >
        <q-item-side >
            <q-item-main :label="`KMs: ${item.km_actual}`" :sublabel="`Lts add: ${item.lts_add}`" />
        </q-item-side>
 
        <q-item-main :label="`KM/LT: ${item.km_lt ? item.km_lt : '-'}`" />

        <q-item-side right>
            <q-item-main :label="`Total: $${item.total}`" :sublabel="`When: ${formatDate(item.date)}`" />
        </q-item-side>
      </q-item>
    </q-list>
  </q-page>
</template>

<style>
</style>

<script>
import { date } from 'quasar'

export default {
  name: 'PageIndex',

  methods:{
    async action(index){
      await this.$q.actionSheet({
        title: 'What u doin?',

        actions: [
          {
            label: 'Delete this',
            color: 'negative',
            icon: 'delete', // specify ONLY IF using icon
            handler: () =>  {
              this.$store.dispatch('fuel/remove', {index: index})
            }
          },

          {
            label: 'Edit this',
            color: 'default',
            icon: 'edit', // specify ONLY IF using icon
            handler: () =>  {
              this.$router.push({path: '/tracks/new', query: {index: index}})
            }
          },
        ]
      })
    },

    swipe(){
      this.$router.push('/tracks/new')
    },

    formatDate(dateA){
      return date.formatDate(dateA, 'DD/MM/YYYY')
    }
  },

  computed:{
    isNight(){
      var now = new Date();
      var formated = parseInt(date.formatDate(now, 'H'))
      return (formated > 18 || formated < 7 )
    },
    
    total_effectness(){
      if(!this.fuels.length) return 0

      return (this.fuels.filter(e => e.km_lt).map(e => e.km_lt).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / this.fuels.filter(e => e.km_lt).length
    },

    total_wheeled(){
      if(!this.fuels.length) return 0
      return (this.fuels.filter(e => e.wheeled).map(e => e.wheeled).reduce((a, b) => parseFloat(a) + parseFloat(b), 0))
    },

    total_lts(){
      if(!this.fuels.length) return 0

      return (this.fuels.filter(e => e.lts_add).map(e => parseFloat(e.lts_add)).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)).toFixed(2)
    },

    fuels(){
      if(!this.$store.state.fuel.data){
        return []
      }

      return this.$store.state.fuel.data
    }
  }
}
</script>

<style>
.bg-black,
.bg-black .q-input-target, .bg-black .q-input-shadow{
  color: gray!important;
}
</style>
