<template>
  <q-page class="flex flex-center" v-if="!fuels.length">
    <q-btn 
      id="create-first-track"
      :color="isNight ? 'dark' : 'primary'"
      label="CREATE FIRST TRACK" 
      to="/tracks/new"
    />
  </q-page>

  <q-page v-touch-swipe.mouse.left.right="swipe" v-else>
    <q-list bordered padding>
      <q-item-label header>Your track list</q-item-label>

      <q-item >
        <q-item-section>
          <q-item-label>Lts Total: {{total_lts}}</q-item-label>
          <q-item-label >Wheeled: {{total_wheeled}}Kms</q-item-label>
        </q-item-section>
        
        <q-item-section side top>
            <q-item-label>
              Effectness: {{total_effectness}}km/lt
            </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item 
        clickable 
        v-ripple
        @click.native="action(index)" 
        v-for="(item, index) in fuels" 
        :key="index" 
        :id="`track_${index}`"
      >
        <q-item-section>
          <q-item-label>${{item.total}} on {{formatDate(item.date)}}</q-item-label>
          <q-item-label caption lines="2">at {{item.km_actual}}kms add {{item.lts_add}}Lts</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption v-if="item.km_lt">{{item.km_lt}} km/lt</q-item-label>
        </q-item-section>
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
    action(index){
      this.$q.bottomSheet({
        title: 'What u doin?',

        actions: [
          {
            label: 'Delete this',
            color: 'negative',
            id: 'delete-this',
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
        ],

        
      }).onOk(this.actionOk)
    },

    actionOk(data){
      data.handler()
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
      if(!this.fuels.filter(e => e.km_lt).length) return 0

      return ((this.fuels.filter(e => e.km_lt).map(e => e.km_lt).reduce((a, b) => parseFloat(a) + parseFloat(b), 0)) / this.fuels.filter(e => e.km_lt).length).toFixed(2)
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
