import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type Role = 'Market' | 'Finance' | 'Development';

export interface TableData extends DataModel {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  role: Role;
}

const INITIAL_DATA_STORE: TableData[] = [
  {
    id: 1,
    name: 'Edward Perry',
    age: 25,
    joinDate: new Date().toISOString(),
    role: 'Finance',
  },
  {
    id: 2,
    name: 'Josephine Drake',
    age: 36,
    joinDate: new Date().toISOString(),
    role: 'Market',
  },
  {
    id: 3,
    name: 'Cody Phillips',
    age: 19,
    joinDate: new Date().toISOString(),
    role: 'Development',
  },
];

const getDataStore = (): TableData[] => {
  const value = localStorage.getItem('data-store');
  return value ? JSON.parse(value) : INITIAL_DATA_STORE;
};

const setDataStore = (value: TableData[]) => {
  return localStorage.setItem('data-store', JSON.stringify(value));
};

export const dataTableSource: DataSource<TableData> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'age', headerName: 'Age', type: 'number' },
    {
      field: 'joinDate',
      headerName: 'Join date',
      type: 'date',
      valueGetter: (value) => value && new Date(value),
      width: 140,
    },
    {
      field: 'role',
      headerName: 'Department',
      type: 'singleSelect',
      valueOptions: ['Market', 'Finance', 'Development'],
      width: 160,
    },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    let filteredData = [...getDataStore()];

    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }

        filteredData = filteredData.filter((item) => {
          const itemValue = item[field];

          switch (operator) {
            case 'contains':
              return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return itemValue === value;
            case 'startsWith':
              return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return (itemValue as number) > value;
            case '<':
              return (itemValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortModel?.length) {
      filteredData.sort((a, b) => {
        for (const sort of sortModel) {
          const { field, sort: sortDirection } = sort;
          const aValue = a[field];
          const bValue = b[field];

          if (aValue === bValue) {
            continue;
          }

          const compareResult = aValue < bValue ? -1 : 1;
          return sortDirection === 'asc' ? compareResult : -compareResult;
        }

        return 0;
      });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedData = filteredData.slice(start, end);

    return {
      rows: paginatedData,
      rowCount: filteredData.length,
    };
  },
  getOne: async ({ id }) => {
    const item = getDataStore().find((item) => item.id === id);
    if (!item) {
      throw new Error('Not found');
    }
    return item;
  },
  create: async (newItem) => {
    const store = getDataStore();
    const item = {
      ...newItem,
      id: Math.max(0, ...store.map((item) => item.id)) + 1,
    };
    store.push(item);
    setDataStore(store);
    return item;
  },
  update: async (id, updates) => {
    const store = getDataStore();
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Not found');
    }
    const item = { ...store[index], ...updates };
    store[index] = item;
    setDataStore(store);
    return item;
  },
  delete: async (id) => {
    const store = getDataStore();
    const index = store.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error('Not found');
    }
    store.splice(index, 1);
    setDataStore(store);
  },
};

export const dataTableCache = new DataSourceCache(dataTableSource);
