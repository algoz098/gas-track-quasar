
import { date } from 'quasar'

export default ({ Vue }) => {
  Vue.mixin({
    computed:{
      isNight(){
        // return true
        var now = new Date();
        var formated = parseInt(date.formatDate(now, 'H'))
        return (formated > 18 || formated < 7 )
      },
    }
  })
}
