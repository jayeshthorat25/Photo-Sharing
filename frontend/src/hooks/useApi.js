import { useState, useEffect, useCallback } from 'react';

// Generic hook for API calls
export const useApi = (
  apiCall,
  dependencies = []
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, isLoading, error, refetch: execute };
};

// Hook for mutations (POST, PUT, DELETE)
export const useMutation = (
  mutationFn
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (variables) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn]);

  const callApi = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn(args[0]);
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn]);

  return { mutate, callApi, data, isLoading, error };
};

// Hook for infinite queries (pagination)
export const useInfiniteQuery = (
  queryFn,
  getNextPageParam
) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextPageParam, setNextPageParam] = useState(0);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn(nextPageParam);
      setData(prev => [...prev, ...result.documents]);
      
      if (getNextPageParam) {
        const nextParam = getNextPageParam(result);
        setNextPageParam(nextParam);
        setHasNextPage(nextParam !== null);
      } else {
        setHasNextPage(result.documents.length > 0);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, nextPageParam, hasNextPage, isLoading, getNextPageParam]);

  useEffect(() => {
    fetchNextPage();
  }, []);

  return { 
    data: { documents: data }, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage 
  };
};
