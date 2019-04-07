<template>
<div>
    <q-list :dark="isNight" separator >
        <q-item >
            <q-item-section>Menu do Gas Track Quasar</q-item-section>
        </q-item>

        <q-item 
            id="clear-list"
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
            id="show-uid"
            clickable
            v-ripple 
            @click="showUid"
        >
            <q-item-section>
                <q-item-label overline>UID</q-item-label>
                <q-item-label>What's my UID for the cloud?</q-item-label>
            </q-item-section>
        </q-item>

        <q-item 
            id="show-rate-us"
            clickable
            v-ripple 
            @click="voteForm.show = true"
        >
            <q-item-section>
                <q-item-label overline>RATE US</q-item-label>
                <q-item-label>Tell us how bad we are doing</q-item-label>
            </q-item-section>
        </q-item>
    </q-list>

    <q-dialog 
        v-model="voteForm.show"
    >
        <q-card>
            <q-card-section>
                <div class="text-h6">5 stars?</div>
            </q-card-section>

            <q-card-section>
                How much start we deserve?
                
                <br>
                
                <q-rating v-model="voteForm.stars" :max="5" size="32px" />

                <q-field
                    class="full-width q-my-md"
                >
                    <q-input 
                        id="rate-us-comment"
                        type="textarea"
                        class="full-width "
                         label="More to say?" v-model="voteForm.comment" />
                </q-field>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" @click="submitVoteForm" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</div>
</template>

<script>
import { 
  date,
  LocalStorage as $ls,
} from 'quasar'
export default {
    name: 'side-menu',

    data(){
        return {
            voteForm: {
                show: false,
                origin: 'gas-track',
                comment: '',
                stars: 0
            },
        }
    },

    methods: {
        async submitVoteForm(){
            try {
                var response = await this.$axios.post(`${this.$store.state.fuel.endpoint}votes`, this.voteForm)
                this.$q.notify('Thank you! =)')
                this.voteForm.show = false
            } catch (error) {
                console.log(error)
                this.$q.notify('Something is wrong! Try again latter =(')
            }
        },

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

