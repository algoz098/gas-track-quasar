<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        :class="isNight ? 'bg-blue-grey-10 text-white' : 'bg-primary'"
      >
        <q-btn dense flat round icon="menu" @click="left = !left" />

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
        
      </q-toolbar>
    </q-header>
    
    <q-drawer 
      :content-class="isNight ? 'bg-blue-grey-10 text-white' : ''"
      v-model="left" 
      side="left" 
    >
      <side-menu />
    </q-drawer>

    <q-page-sticky position="bottom-right" :offset="[32, 32]" style="z-index: 1" v-if="!scrolled">
      <q-btn
          round
          id="add-track-btn"
          size="lg"
          aria-label="add"
          v-if="$route.path == '/'"
          to="/tracks/new"
          :color="isNight ? 'blue-grey-10' : 'primary'"
        >
          <q-icon name="add" />
        </q-btn>
    </q-page-sticky>

    <q-page-container :class="{'bg-black': isNight}">
      <q-scroll-observer @scroll="scrollHandler" />

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
import sideMenu from '../components/sideMenu'
import { openURL } from 'quasar'

import { 
  date,
  LocalStorage as $ls,
} from 'quasar'

export default {
  name: 'MyLayout',

  components:{
    sideMenu
  },

  data () {
    return {
      scrolled: false,
      left: false,
      carouselHome: true
    }
  },

  created(){
    this.$store.dispatch('fuel/starting')
  },
  
  methods:{
    scrollHandler(e){
      if(e.position > 3) this.scrolled = true
      else if (e.position < 3) this.scrolled = false
    }
  },

  computed:{
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
