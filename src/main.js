import Vue from 'vue'
import App from './App.vue'
import MuseUI from 'muse-ui'

Vue.use(MuseUI)

new Vue({
  el: '#app',
  render: h => h(App)
})
