import type { FilterCategory } from '../store/types/user';

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
  if (filter.list.length === 0) return items;
  const filterSet = new Set(filter.list.map(filterKey));
  if (filter.mode === 'INCLUDE') {
    return items.filter(item => filterSet.has(getKey(item)));
  }
  return items.filter(item => !filterSet.has(getKey(item)));
}

import type { PostingGroup } from '../services/postingGroupsApi';
import type {
  FilterPostingGroup,
  FilterCategory as FC,
  FilterLocation,
  FilterMenuOption,
  MenuOption,
} from '../store/types/user';

/** Filter a posting groups (jobs) list. Uses job.number → filter.code mapping. */
export function applyPostingGroupFilter(
  groups: PostingGroup[],
  filter: FC<FilterPostingGroup>,
): PostingGroup[] {
  return applyInclusivityFilter(groups, filter, g => g.number, f => f.code);
}

/** Filter a locations list. Uses location.code → filter.code mapping. */
export function applyLocationFilter<T extends { code: string }>(
  locations: T[],
  filter: FC<FilterLocation>,
): T[] {
  return applyInclusivityFilter(locations, filter, l => l.code, f => f.code);
}

/** Filter a menu options list. Uses menuOption.segment → filter.segment mapping. */
export function applyMenuOptionFilter(
  options: MenuOption[],
  filter: FC<FilterMenuOption>,
): MenuOption[] {
  return applyInclusivityFilter(options, filter, o => o.segment, f => f.segment);
}
