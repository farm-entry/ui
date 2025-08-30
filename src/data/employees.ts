import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';
import { useEmployeeStore } from '../store/employeeStore';

type EmployeeRole = 'Market' | 'Finance' | 'Development';

export interface Employee extends DataModel {
  id: number;
  name: string;
  age: number;
  joinDate: string;
  role: EmployeeRole;
}

export const employeesDataSource: DataSource<Employee> = {
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
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    let filteredEmployees = [...useEmployeeStore.getState().employees];

    // Apply filters
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) {
          return;
        }

        filteredEmployees = filteredEmployees.filter((employee) => {
          const employeeValue = employee[field];

          switch (operator) {
            case 'contains':
              return String(employeeValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return employeeValue === value;
            case 'startsWith':
              return String(employeeValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(employeeValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return (employeeValue as number) > value;
            case '<':
              return (employeeValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortModel?.length) {
      filteredEmployees.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if ((a[field] as number) < (b[field] as number)) {
            return sort === 'asc' ? -1 : 1;
          }
          if ((a[field] as number) > (b[field] as number)) {
            return sort === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedEmployees = filteredEmployees.slice(start, end);

    return {
      items: paginatedEmployees,
      itemCount: filteredEmployees.length,
    };
  },

  getOne: async (employeeId) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const employee = useEmployeeStore.getState().employees.find(
      (emp: Employee) => emp.id === Number(employeeId)
    );

    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  },

  createOne: async (data) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const store = useEmployeeStore.getState();
    const newEmployee = {
      id: store.getNextId(),
      ...data,
    } as Employee;

    store.addEmployee(newEmployee);
    return newEmployee;
  },

  updateOne: async (employeeId, data) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const store = useEmployeeStore.getState();
    store.updateEmployee(Number(employeeId), data);
    
    const updatedEmployee = store.employees.find(
      (emp: Employee) => emp.id === Number(employeeId)
    );

    if (!updatedEmployee) {
      throw new Error('Employee not found');
    }
    return updatedEmployee;
  },

  deleteOne: async (employeeId) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    useEmployeeStore.getState().deleteEmployee(Number(employeeId));
  },

  validate: z.object({
    name: z.string({ required_error: 'Name is required' }).nonempty('Name is required'),
    age: z.number({ required_error: 'Age is required' }).min(18, 'Age must be at least 18'),
    joinDate: z
      .string({ required_error: 'Join date is required' })
      .nonempty('Join date is required'),
    role: z.enum(['Market', 'Finance', 'Development'], {
      errorMap: () => ({ message: 'Role must be "Market", "Finance" or "Development"' }),
    }),
  })['~standard'].validate,
};

export const employeesCache = new DataSourceCache();
