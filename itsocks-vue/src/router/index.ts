import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/medias/:subcategoria',
      component: () => import('@/pages/medias/MediasLayout.vue'),
      children: [
        {
          path: '',
          name: 'subcategory',
          component: () => import('@/pages/medias/SubcategoryPage.vue'),
        },
        {
          path: ':tipo',
          name: 'product-list-type',
          component: () => import('@/pages/medias/ProductListPage.vue'),
        },
        {
          path: ':tipo/:disenio',
          name: 'product-list-design',
          component: () => import('@/pages/medias/ProductListPage.vue'),
        },
        {
          path: ':tipo/:disenio/:compresion',
          name: 'product-list-compresion',
          component: () => import('@/pages/medias/ProductListPage.vue'),
        },
        {
          path: ':tipo/:disenio/:compresion/:nombre',
          name: 'product-detail',
          component: () => import('@/pages/products/ProductDetailPage.vue'),
        },
      ],
    },
    // Legacy search route
    {
      path: '/search',
      redirect: '/buscar',
    },
    {
      path: '/buscar',
      name: 'search',
      component: () => import('@/pages/SearchPage.vue'),
    },
    {
      path: '/packs',
      name: 'packs',
      component: () => import('@/pages/packs/PacksPage.vue'),
    },
    {
      path: '/packs/:id',
      name: 'pack-detail',
      component: () => import('@/pages/packs/PackDetailPage.vue'),
    },
    {
      path: '/carrito',
      name: 'cart',
      component: () => import('@/pages/checkout/CartPage.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/pages/checkout/CheckoutPage.vue'),
    },
    {
      path: '/billing',
      name: 'billing',
      component: () => import('@/pages/checkout/BillingPage.vue'),
    },
    {
      path: '/order/:id',
      name: 'order-confirmation',
      component: () => import('@/pages/checkout/OrderConfirmationPage.vue'),
    },
    {
      path: '/lista_de_favoritos',
      name: 'wishlist-own',
      component: () => import('@/pages/WishListPage.vue'),
    },
    {
      path: '/wishlist/:token',
      name: 'wishlist-shared',
      component: () => import('@/pages/WishListPage.vue'),
    },
    {
      path: '/lista_de_favoritos/:token',
      name: 'wishlist-shared-legacy',
      component: () => import('@/pages/WishListPage.vue'),
    },
    {
      path: '/guia-de-tallas',
      name: 'size-guide',
      component: () => import('@/pages/info/SizeGuidePage.vue'),
    },
    {
      path: '/envios',
      name: 'shipping-policy',
      component: () => import('@/pages/info/ShippingPolicyPage.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/pages/info/FAQPage.vue'),
    },
    {
      path: '/politica-de-datos',
      name: 'privacy',
      component: () => import('@/pages/info/PrivacyPage.vue'),
    },
    // Redirect legacy URLs
    {
      path: '/medias',
      redirect: '/',
    },
    {
      path: '/accesorios',
      redirect: '/medias/accesorios',
    },
    {
      path: '/temporada',
      redirect: '/',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

export default router
