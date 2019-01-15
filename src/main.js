import Vue from 'vue'
import App from './ClassicSnake.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
