import apiClient from './client'
import type { Product, PaginatedResponse, ProductFilters } from '@/types'

export const productApi = {
  getProducts(filters: ProductFilters = {}) {
    const params: Record<string, unknown> = {}
    if (filters.subcategory) params['filter[subcategory]'] = filters.subcategory
    if (filters.type) params['filter[type]'] = filters.type
    if (filters.design) params['filter[design]'] = filters.design
    if (filters.compresion !== undefined) params['filter[compresion]'] = filters.compresion
    if (filters.tag) params['filter[tag]'] = filters.tag
    if (filters.search) params['filter[search]'] = filters.search
    if (filters.page) params.page = filters.page
    if (filters.per_page) params.per_page = filters.per_page
    params.include = 'images,subcategory,type,design,tags'

    return apiClient.get<PaginatedResponse<Product>>('/products', { params })
  },

  getProduct(id: number) {
    return apiClient.get<Product>(`/products/${id}`, {
      params: { include: 'images,sizes,colors,subcategory,type,design,tags' },
    })
  },

  getProductBySlug(slug: string) {
    return apiClient.get<Product>(`/products/slug/${slug}`, {
      params: { include: 'images,sizes,colors,subcategory,type,design,tags' },
    })
  },

  searchProducts(query: string) {
    return apiClient.get<Product[]>('/products/search', { params: { q: query } })
  },

  getProductsBySubcategory(subcategory: string) {
    return apiClient.get<PaginatedResponse<Product>>('/products', {
      params: {
        'filter[subcategory]': subcategory,
        include: 'images,subcategory,type,design,tags',
      },
    })
  },

  validateDiscount(code: string) {
    return apiClient.post<{ valid: boolean; discount: number; type: string; message?: string }>(
      '/discounts/validate',
      { code },
    )
  },

  getFilters(category?: string) {
    return apiClient.get('/products/filters', { params: { category } })
  },
}
