<template>
 <q-list :dark="isNight" separator >
    <q-item >
        <q-item-section>Menu do Gas Track Quasar</q-item-section>
    </q-item>

    <q-item 
        clickable
        v-ripple 
        @click="askToClear"
        v-if="$route.path == '/'"
    >
        <q-item-section>
            <q-item-label overline>CLEAR</q-item-label>
            <q-item-label>Clear your tracks</q-item-label>
        </q-item-section>
    </q-item>
    
    <q-item 
        clickable
        v-ripple 
        @click="showUid"
    >
        <q-item-section>
            <q-item-label overline>UID</q-item-label>
            <q-item-label>What's my UID for the cloud?</q-item-label>
        </q-item-section>
    </q-item>
</q-list>
</template>

<script>
import { 
  date,
  LocalStorage as $ls,
} from 'quasar'
export default {
    name: 'side-menu',

    methods: {
        showUid(){
            this.$q.dialog({
                title: 'Your UID',
                message: $ls.getItem('api_token'),
            })
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
}
</script>

