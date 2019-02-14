import money from 'v-money'

export default ({ Vue }) => {
  Vue.use(money, {precision: 4})
}