export interface IPageInfo {
   hasNext: boolean;
   hasPreview: boolean;
   pageSize: number;
   pageIndex: number
}

export interface IPage<T> {
   totalCount: number;
   content: T[]
   pageInfo: IPageInfo;
}
