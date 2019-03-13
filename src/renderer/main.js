import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import { Button, Input, Option, Select, ButtonGroup, Dialog } from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Option);
Vue.use(Select);
Vue.use(ButtonGroup);
Vue.use(Dialog);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
