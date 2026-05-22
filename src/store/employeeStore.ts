import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Employee } from '../data/employees';

interface EmployeeState {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: number, employee: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  getNextId: () => number;
  reset: () => void;
}

const INITIAL_EMPLOYEES: Employee[] = [
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

type EmployeeStore = StateCreator<EmployeeState>;

export const useEmployeeStore = create<EmployeeState>()(
  devtools(
    ((set: (fn: (state: EmployeeState) => EmployeeState) => void, get: () => EmployeeState) => ({
    employees: INITIAL_EMPLOYEES,
    
    setEmployees: (employees: Employee[]) => 
      set((state: EmployeeState) => ({ ...state, employees })),
    
    addEmployee: (employee: Employee) => 
      set((state: EmployeeState) => ({ ...state, employees: [...state.employees, employee] })),
    
    updateEmployee: (id: number, updatedEmployee: Partial<Employee>) => 
      set((state: EmployeeState) => ({
        ...state,
        employees: state.employees.map((employee: Employee) =>
          employee.id === id ? { ...employee, ...updatedEmployee } : employee
        ),
      })),
    
    deleteEmployee: (id: number) => 
      set((state: EmployeeState) => ({
        ...state,
        employees: state.employees.filter((employee: Employee) => employee.id !== id),
      })),
    
    getNextId: () => {
      const state = get();
      return state.employees.reduce((max: number, employee: Employee) => Math.max(max, employee.id), 0) + 1;
    },

    reset: () =>
      set((state: EmployeeState) => ({ ...state, employees: INITIAL_EMPLOYEES })),
  })) as EmployeeStore,
    { name: "EmployeeStore" }
  )
);