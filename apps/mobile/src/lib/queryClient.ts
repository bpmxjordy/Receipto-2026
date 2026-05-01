/**
 * TanStack Query client configuration.
 *
 * Shared QueryClient instance with sensible defaults for a mobile app:
 * - 5 minute stale time (Firestore data doesn't change that fast)
 * - 1 retry (network issues on mobile are transient)
 * - No refetch on window focus (not relevant for mobile)
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 30 * 60 * 1000,         // 30 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
