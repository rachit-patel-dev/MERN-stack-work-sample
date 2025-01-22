interface IRequest {
    protocol: string;
    get(header: string): string;
    baseUrl: string;
  }
  
  interface IPaginatorMeta {
    Pages: number;
    PageSize: number;
    PageNumber: number;
    TotalCount: number;
    Next: string | null;
    Previous: string | null;
  }
  
  const paginator = async (
    req: IRequest,
    totalCount: number,
    limit: number,
    count: number,
    pageNumber: number,
    isSearchable: boolean = false
  ): Promise<IPaginatorMeta> => {
    const startIndex = pageNumber * limit;
    const endIndex = Math.min(startIndex + limit, totalCount);
    const paginateMeta: IPaginatorMeta = {
      Pages: Math.ceil(totalCount / limit),
      PageSize: count,
      PageNumber: pageNumber,
      TotalCount: totalCount,
      Next: null,
      Previous: null,
    };
  
    if (endIndex < totalCount) {
      const nextUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}?PageSize=${limit}&PageNumber=${pageNumber + 1}`;
      paginateMeta.Next = nextUrl;
    }
  
    if (startIndex > 0) {
      const previousUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}?PageSize=${limit}&PageNumber=${pageNumber - 1}`;
      paginateMeta.Previous = previousUrl;
    }
  
    if (isSearchable && (count < totalCount) && (count < limit)) {
      paginateMeta.Next = null;
    }
  
    if (paginateMeta.PageNumber === 0 && paginateMeta.PageSize === 0) {
      paginateMeta.Pages = 0;
    }
  
    return paginateMeta;
  };
  
  export default { paginator };