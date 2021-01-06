export const calculatorsRoutes = {
  path: '/calculators',
  name: 'calculators',
  component: () => import(/* webpackChunkName: "home" */ '../components/admin/AppLayout'),
  children: [
    {
      path: 'mortgage',
      name: 'mortgage',
      component: () => import(/* webpackChunkName: "home" */ '@/views/calculators/Mortgage.vue')
    }
  ]
}
