import { useFilterState } from "../useFilterState";
import { useCompoundExpansionState } from "../useCompoundExpansionState";
import { useSelectionState } from "@migtools/lib-ui";
import { usePaginationDerivedState, usePaginationState } from "./pagination";
import { useSortState, useSortDerivedState } from "./sorting";
import { IUseTableControlStateArgs, IUseTableControlPropsArgs } from "./types";

export const useTableControlState = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey
>(
  args: IUseTableControlStateArgs<TItem, TColumnKey, TSortableColumnKey>
): IUseTableControlPropsArgs<TItem, TColumnKey, TSortableColumnKey> => {
  const {
    items,
    filterCategories = [],
    filterStorageKey,
    sortableColumns = [],
    getSortValues,
    initialSort = null,
    hasPagination = true,
    initialItemsPerPage = 10,
    idProperty,
  } = args;

  const filterState = useFilterState(items, filterCategories, filterStorageKey);

  const expansionState = useCompoundExpansionState<TItem, TColumnKey>(
    idProperty
  );

  const selectionState = useSelectionState({
    items: filterState.filteredItems,
    isEqual: (a, b) => a[idProperty] === b[idProperty],
  });

  const sortState = useSortState({ sortableColumns, initialSort });
  const { sortedItems } = useSortDerivedState({
    sortState,
    items: filterState.filteredItems,
    getSortValues,
  });

  const paginationState = usePaginationState({
    initialItemsPerPage,
  });
  const { currentPageItems } = usePaginationDerivedState({
    paginationState,
    items,
  });

  return {
    ...args,
    filterState,
    expansionState,
    selectionState,
    sortState,
    paginationState,
    totalItemCount: items.length,
    currentPageItems: hasPagination ? currentPageItems : sortedItems,
  };
};
