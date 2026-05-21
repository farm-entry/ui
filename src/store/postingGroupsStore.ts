import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  postingGroupsApi as api,
  PostingGroup,
  PostingGroupDetails,
} from "../services/postingGroupsApi";
import { applyPostingGroupFilter } from "../utils/filterHelpers";
import { useUserStore } from "./userStore";

interface PostingGroupsDataState {
  postingGroupDetails: PostingGroupDetails;
  postingGroups: PostingGroup[];
  isLoading: boolean;
  error: string | null;
  getPostingGroupDetails: (group: string | number) => Promise<PostingGroupDetails | undefined>;
  getPostingGroups: () => Promise<PostingGroup[] | undefined>;
  setPostingGroups: (postingGroups: PostingGroup[]) => void;
  clearPostingGroups: () => void;
  clearPostingGroupDetails: () => void;
  fetchPostingGroups: () => Promise<void>;
}

export const usePostingGroupsStore = create<PostingGroupsDataState>()(
  devtools(
    (set, get) => ({
      postingGroupDetails: {}, // Initial state
      postingGroups: [], // Initial state
      isLoading: false,
      error: null,

      getPostingGroupDetails: async (group: string) => {
        try {
          if (group != get().postingGroupDetails.number) {
            // Make API call
            set((state) => ({ ...state, isLoading: true }));

            const postingGroupDetails = await api.fetchPostingGroup(group);

            // Update state with fetched data
            set((state) => ({
              ...state,
              postingGroupDetails,
              isLoading: false,
            }));
          }
          return get().postingGroupDetails;
        } catch (error) {
          console.log("Caught error while fetching posting groups:", error);
          // Handle error
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          }));
        }
      },
      getPostingGroups: async () => {
        try {
          if (get().postingGroups.length === 0) {
            // Make API call
            set((state) => ({ ...state, isLoading: true }));
            const postingGroups = await api.fetchAllPostingGroups();

            // Update state with fetched data
            set((state) => ({
              ...state,
              postingGroups,
              isLoading: false,
            }));
          }
          return get().postingGroups;
        } catch (error) {
          console.log("Caught error while fetching posting groups:", error);
          // Handle error
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          }));
        }
      },

      setPostingGroups: (postingGroups: PostingGroup[]) =>
        set((state) => ({ ...state, postingGroups })),

      clearPostingGroups: () =>
        set((state) => ({ ...state, postingGroups: [] })),

      clearPostingGroupDetails: () =>
        set({ postingGroupDetails: {} as PostingGroupDetails }),

      fetchPostingGroups: async () => {
        try {
          // Make API call
          set((state) => ({ ...state, isLoading: true }));
          const postingGroups = await api.fetchAllPostingGroups();

          // Update state with fetched data
          set((state) => ({
            ...state,
            postingGroups,
            isLoading: false,
          }));
        } catch (error) {
          console.log("Caught error while fetching posting groups:", error);
          // Handle error
          set((state) => ({
            ...state,
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          }));
        }
      },
    }),
    { name: "PostingGroupsStore" }
  )
);

/**
 * Returns posting groups filtered by the current user's postingGroups filter settings.
 * Drop-in replacement for usePostingGroupsStore(state => state.postingGroups) in components
 * that should respect the user's filter preferences.
 */
export function useFilteredPostingGroups(): PostingGroup[] {
  const postingGroups = usePostingGroupsStore(state => state.postingGroups);
  const filter = useUserStore(state => state.filters.postingGroups);
  return applyPostingGroupFilter(postingGroups, filter);
}
