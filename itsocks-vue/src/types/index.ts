// ============================
// Core domain types
// ============================

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface Image {
  id: number
  url: string
  alt?: string
  order?: number
}

export interface Size {
  id: number
  name: string
  available?: boolean
}

export interface Color {
  id: number
  name: string
  hex?: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Design {
  id: number
  name: string
  slug: string
}

export interface ProductType {
  id: number
  name: string
  slug: string
}

export interface Subcategory {
  id: number
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  compresion: boolean
  design: Design
  type: ProductType
  subcategory: Subcategory
  category?: Category
  images: Image[]
  sizes: Size[]
  colors: Color[]
  tags: Tag[]
  description?: string
  stock?: number
}

export interface Pack {
  id: number
  name: string
  slug: string
  price: number
  description?: string
  images: Image[]
  products: PackProduct[]
  discount_percentage?: number
}

export interface PackProduct {
  id: number
  product: Product
  quantity: number
}

export interface CartItem {
  product: Product
  size: Size
  quantity: number
  pack_id?: number
  price: number
}

export interface WishlistItem {
  product: Product
  addedAt: string
}

export interface Order {
  id: number
  customer_name: string
  email: string
  phone: string
  total: number
  subtotal: number
  shipping_cost: number
  discount_amount: number
  payment_id: string
  billing_address: string
  gift_from?: string
  gift_to?: string
  is_gift: boolean
  status: OrderStatus
  tracking_number?: string
  items: OrderItem[]
  created_at?: string
}

export interface OrderItem {
  id: number
  product: Product
  size: Size
  quantity: number
  price: number
}

export interface ShippingCity {
  id: number
  name: string
  department: string
  rate: number
  estimated_days?: number
}

export interface ShippingDepartment {
  name: string
  cities: ShippingCity[]
}

export interface DiscountCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  valid: boolean
  message?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: string
}

// ============================
// API response wrappers
// ============================

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links?: {
    first?: string
    last?: string
    prev?: string | null
    next?: string | null
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// ============================
// Filter types
// ============================

export interface ProductFilters {
  subcategory?: string
  type?: string
  design?: string
  compresion?: boolean
  tag?: string
  search?: string
  page?: number
  per_page?: number
}

// ============================
// Checkout form types
// ============================

export interface ShippingFormData {
  name: string
  lastName: string
  email: string
  phone: string
  document: string
  department: string
  city: string
  address: string
  notes?: string
}

export interface BillingFormData {
  is_gift: boolean
  gift_from?: string
  gift_to?: string
  company_name?: string
  nit?: string
  billing_address?: string
}
