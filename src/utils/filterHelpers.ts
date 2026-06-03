import type { FilterCategory } from '../store/types/user';

/**
 * Returns a predicate that passes items based on INCLUDE/EXCLUDE mode.
 * If the filter list is empty the predicate always returns true.
 */
export function makeInclusivityPredicate<TFilter>(
  filter: FilterCategory<TFilter>,
  filterKey: (f: TFilter) => string,
): (key: string) => boolean {
  if (filter.list.length === 0) return () => true;
  const filterSet = new Set(filter.list.map(filterKey));
  return filter.mode === 'INCLUDE'
    ? (key) => filterSet.has(key)
    : (key) => !filterSet.has(key);
}

/**
 * Applies an INCLUDE/EXCLUDE filter to a list of items.
 * If the filter list is empty, all items are returned regardless of mode.
 *
 * @param items - The full list of items to filter
 * @param filter - The user's filter settings for this category
 * @param getKey - Function that extracts the comparable key from each item
 * @param filterKey - Function that extracts the comparable key from each filter entry
 */
export function applyInclusivityFilter<TItem, TFilter>(
  items: TItem[],
  filter: FilterCategory<TFilter>,
  getKey: (item: TItem) => string,
  filterKey: (f: TFilter) => string,
): TItem[] {
  const passes = makeInclusivityPredicate(filter, filterKey);
  return items.filter(item => passes(getKey(item)));
}

import type { PostingGroup } from '../services/postingGroupsApi';
import type {
  FilterPostingGroup,
  FilterCategory as FC,
  FilterLocation,
} from '../store/types/user';

/** Filter a posting groups (jobs) list. Uses job.postingGroup → filter.code mapping. */
export function applyPostingGroupFilter(
  groups: PostingGroup[],
  filter: FC<FilterPostingGroup>,
): PostingGroup[] {
  return applyInclusivityFilter(groups, filter, g => g.postingGroup, f => f.code);
}

/** Filter a locations list. Uses location.code → filter.code mapping. */
export function applyLocationFilter<T extends { code: string }>(
  locations: T[],
  filter: FC<FilterLocation>,
): T[] {
  return applyInclusivityFilter(locations, filter, l => l.code, f => f.code);
}

