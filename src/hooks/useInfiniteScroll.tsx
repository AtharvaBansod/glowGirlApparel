// import { useState, useEffect, useCallback } from 'react';

// interface UseInfiniteScrollOptions {
//   fetchMore: () => void;
//   hasMore: boolean;
//   threshold?: number; // How close to the bottom to trigger the fetch
// }

// export const useInfiniteScroll = ({
//   fetchMore,
//   hasMore,
//   threshold = 200 // Trigger when 200px from the bottom
// }: UseInfiniteScrollOptions) => {
//   const [isFetching, setIsFetching] = useState(false);

//   // Use useCallback to memoize the fetchMore function
//   const memoizedFetchMore = useCallback(fetchMore, []);

//   // Effect to set up the scroll listener
//   useEffect(() => {
//     const handleScroll = () => {
//       // Check if we should fetch:
//       // 1. We have more data to load
//       // 2. We are not already fetching
//       // 3. The user has scrolled close to the bottom of the page
//       if (
//         !hasMore ||
//         isFetching ||
//         window.innerHeight + document.documentElement.scrollTop <
//         document.documentElement.offsetHeight - threshold
//       ) {
//         return;
//       }
//       setIsFetching(true);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, isFetching, threshold]);

//   // Effect to call the fetch function when isFetching becomes true
//   useEffect(() => {
//     if (!isFetching) return;

//     const fetchData = async () => {
//       await memoizedFetchMore();
//       setIsFetching(false);
//     };

//     fetchData();
//   }, [isFetching, memoizedFetchMore]);

//   return { isFetching };
// };