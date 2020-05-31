export interface PageInfoQL {
   hasNext: boolean;
   hasPreview: boolean;
   pageSize: number;
   pageIndex: number
}

export interface PageQL<T> {
   totalCount: number;
   content: T[];
   pageInfo: PageInfoQL;
}
