interface Pagination {
  page: number;
}

export type WithPagination<T extends Record<string, any>> = Partial<T & Pagination>;
