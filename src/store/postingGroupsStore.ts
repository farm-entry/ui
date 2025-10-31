import { create } from "zustand";
import { postingGroupsApi as api, PostingGroup } from "../services/postingGroupsApi";

interface PostingGroupsDataState {
    postingGroups: PostingGroup[];
    isLoading: boolean;
    error: string | null;
    getPostingGroups: () => PostingGroup[];
    setPostingGroups: (postingGroups: PostingGroup[]) => void;
    clearPostingGroups: () => void;
    fetchPostingGroups: () => Promise<void>;
}

export const usePostingGroupsStore = create<PostingGroupsDataState>((set, get) => ({
    postingGroups: [], // Initial state
    isLoading: false,
    error: null,

    getPostingGroups: () => {
        if (get().postingGroups.length === 0) {
            get().fetchPostingGroups();
        }
        return get().postingGroups;
    },

    setPostingGroups: (postingGroups: PostingGroup[]) =>
        set((state) => ({ ...state, postingGroups })),

    clearPostingGroups: () =>
        set((state) => ({ ...state, postingGroups: [] })),

    fetchPostingGroups: async () => {
        try {
            // Set loading state
            set({ isLoading: true, error: null });

            // Make API call
            const postingGroups = await api.fetchActivePostingGroups();

            // Update state with fetched data
            set((state) => ({
                ...state,
                postingGroups,
                isLoading: false
            }));

        } catch (error) {
            // Handle error
            set((state) => ({
                ...state,
                error: error instanceof Error ? error.message : 'An error occurred',
                isLoading: false
            }));
        }
    }
}));
