export type PaginatedResponse<T> = {
  items: T[]
  metadata: PaginationMetadata
}

export type PaginationMetadata = {
  current_page: number
  previous_page: number | null
  next_page: number | null
  total_count: number
  total_pages: number
}

export interface PaginationFilter {
  page?: string
  page_size?: string
}
