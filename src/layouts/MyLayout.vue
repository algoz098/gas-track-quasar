<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        :class="isNight ? 'bg-blue-grey-10 text-white' : 'bg-primary'"
        
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          v-if="$route.path !== '/'"
          to="/"
        >
          <q-icon name="arrow_back" />
        </q-btn>

        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>
        
        <q-btn
          flat
          dense
          round
          aria-label="clear"
          @click="$store.dispatch('fuel/clear')"
          v-if="$route.path == '/'"
        >
          <q-icon name="clear_all" />
        </q-btn>
<!-- 
        <q-btn
          flat
          dense
          round
          aria-label="add"
          v-if="$route.path == '/'"
          to="/tracks/new"
        >
          <q-icon name="add" />
        </q-btn> -->
      </q-toolbar>
    </q-header>

    <q-page-sticky position="bottom-right" :offset="[32, 32]" style="z-index: 1" >
      <q-btn
          round
          id="add-track-btn"
          size="lg"
          aria-label="add"
          v-if="$route.path == '/'"
          to="/tracks/new"
          :dark="isNight"
          :color="isNight ? 'dark' : 'primary'"
        >
          <q-icon name="add" />
        </q-btn>
    </q-page-sticky>

    <q-page-container :class="{'bg-black': isNight}">
      <transition
        name="transitions"
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutLeft"
        mode="out-in"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { date } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },

  created(){
    
    this.$store.dispatch('fuel/starting')
  },
  
  methods: {
    openURL
  },

  computed:{
    isNight(){
      var now = new Date();
      var formated = parseInt(date.formatDate(now, 'H'))
      return (formated > 18 || formated < 7 )
    },

    title(){
      if(this.$route.path == '/') return 'Gas Track Quasar'

      if(this.$route.path == '/tracks/new' && this.$route.query.index) return 'Edit a Gas Track!'

      if(this.$route.path == '/tracks/new') return 'Create a Gas Track!'
    }
  }
}
</script>

<style>
</style>
