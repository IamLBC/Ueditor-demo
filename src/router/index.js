import Vue from 'vue'
import Router from 'vue-router'
import HelloUeditor from '@/components/HelloUeditor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloUeditor',
      component: HelloUeditor
    }
  ]
})
