<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        :class="isNight ? 'bg-blue-grey-10 text-white' : 'bg-primary'"
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
          id="clear-list"
          @click="askToClear"
          v-if="$route.path == '/'"
        >
          <q-icon name="clear_all" />
        </q-btn>

        <q-btn
          flat
          dense
          round
          aria-label="help"
          id="show-help"
          @click="carouselHome.show = true"
          v-if="$route.path == '/'"
        >
          <q-icon name="contact_support" />
        </q-btn>

        
      </q-toolbar>
    </q-header>

    <q-dialog 
      v-model="carouselHome.show"
      @hide="seenCarouselHome"
    >
      <q-carousel
        transition-prev="slide-right"
        transition-next="slide-left"
        swipeable
        animated
        v-model="carouselHome.page"
        control-color="primary"
        navigation-icon="radio_button_unchecked"
        navigation
        padding
        class=" full-width shadow-1 rounded-borders"
        :class="isNight ? 'bg-blue-grey-10 text-primary' : 'bg-primary'"
      >
        <q-carousel-slide :name="1" class="column no-wrap flex-center">
          <q-icon name="style" color="primary" size="56px" />

          <div class="q-mt-md text-center">
            Welcome! This is Gas Track Quasar!<br>

            This should help you discover how much you spend in gas.<br>

            <q-btn
              round
              id="next-slide"
              aria-label="add"
              @click="carouselHome.page++"
              class="q-mt-md"
              :color="isNight ? 'blue-grey-9' : 'primary'"
            >
              <q-icon name="arrow_right" />
            </q-btn>
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="2" class="column no-wrap flex-center">
          <q-icon name="live_tv" color="primary" size="56px" />

          <div class="q-mt-md text-center">
            To use, click on that "<q-icon name="add" />" down there.<br>

            Do this every time you refuel your vehicle.<br>
            
            <q-btn
              round
              id="next-slide"
              aria-label="add"
              @click="carouselHome.page++"
              class="q-mt-md"
              :color="isNight ? 'blue-grey-9' : 'primary'"
            >
              <q-icon name="arrow_right" />
            </q-btn>
          </div>
        </q-carousel-slide>

        <q-carousel-slide :name="3" class="column no-wrap flex-center">
          <q-icon name="layers" color="primary" size="56px" />

          <div class="q-mt-md text-center">
            All tracks will be saved in the Cloud! But remember,<br>
            
            each device will have its own records

            <br>

            <q-btn
              round
              id="next-slide"
              aria-label="add"
              @click="carouselHome.show = false"
              class="q-mt-md"
              :color="isNight ? 'blue-grey-9' : 'primary'"
            >
              <q-icon name="thumb_up" />
            </q-btn>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[32, 32]" style="z-index: 1" >
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
import { 
  date,
  LocalStorage as $ls 
} from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      carouselHome: {
        show: false,
        page: 1
      },
    }
  },

  created(){
    if(!$ls.getItem('carouselHome')) this.carouselHome.show = true 

    this.$store.dispatch('fuel/starting')
  },
  
  methods: {
    seenCarouselHome(){
      $ls.set('carouselHome', true)
    },

    askToClear(){
      this.$q.dialog({
        title: 'Are you certain?',
        message: 'This will clear the tracks you have, but just in you device',
      
        cancel: {
          color: 'negative'
        },
        
        persistent: true
      }).onOk(() => {
        this.$store.dispatch('fuel/clear')
      })
    },
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
