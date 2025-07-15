import { useCallback, useEffect, useState } from "react";

interface PaginatedResponse<T> {
  results: T[];
  total_pages: number;
  page: number;
}

const useInfiniteScroll = <T>(
  fetchFunction: (page: number) => Promise<PaginatedResponse<T>>
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading || loadingMore) return;

      try {
        if (reset) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const response = await fetchFunction(pageNum);

        if (reset) {
          setData(response.results);
        } else {
          setData((prev) => [...prev, ...response.results]);
        }

        setHasMore(pageNum < response.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetchFunction, loading, loadingMore]
  );

  useEffect(() => {
    loadData(1, true);
  }, []);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  const refresh = () => {
    setPage(1);
    loadData(1, true);
  };

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

export default useInfiniteScroll;
