interface Pagination {
  page_size: number;
}

export type WithPagination<T extends Record<string, any>> = Partial<T & Pagination>;
