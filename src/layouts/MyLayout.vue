<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
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

        <q-btn
          flat
          dense
          round
          aria-label="add"
          v-if="$route.path == '/'"
          to="/tracks/new"
        >
          <q-icon name="add" />
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
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

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },

  created(){
    this.$store.dispatch('fuel/get')
  },
  
  methods: {
    openURL
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
