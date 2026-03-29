import { User, School, Class, Student, AppState } from '../types';

const STORAGE_KEY = 'school_management_data';

// Default admin credentials
const DEFAULT_ADMIN: User = {
  id: 'admin-1',
  username: 'admin',
  password: 'max',
  role: 'admin',
  name: 'Super Admin',
  createdAt: new Date().toISOString(),
};

// Default teacher credentials
const DEFAULT_TEACHER: User = {
  id: 'teacher-1',
  username: 'teacher1',
  password: 'teacher123',
  role: 'teacher',
  name: 'John Doe',
  classId: 'class-1',
  createdAt: new Date().toISOString(),
};

const DEFAULT_SCHOOL: School = {
  id: 'school-1',
  name: 'Demo Public School',
  address: '123 Education Street, City',
  createdAt: new Date().toISOString(),
};

const DEFAULT_CLASSES: Class[] = [
  { id: 'class-1', name: 'Class 1', schoolId: 'school-1', teacherId: 'teacher-1', createdAt: new Date().toISOString() },
  { id: 'class-2', name: 'Class 2A', schoolId: 'school-1', createdAt: new Date().toISOString() },
  { id: 'class-3', name: 'Class 2B', schoolId: 'school-1', createdAt: new Date().toISOString() },
  { id: 'class-4', name: 'Class 3A', schoolId: 'school-1', createdAt: new Date().toISOString() },
  { id: 'class-5', name: 'Class 3B', schoolId: 'school-1', createdAt: new Date().toISOString() },
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student-1',
    name: 'John Smith',
    classId: 'class-1',
    className: 'Class 1',
    schoolName: 'Green Valley High School',
    rollNumber: '001',
    fatherName: 'James Smith',
    motherName: 'Mary Smith',
    phone1: '1234567890',
    phone2: '0987654321',
    address: '123 Main Street',
    stsNumber: 'STS001',
    status: 'submitted',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'student-2',
    name: 'Emily Johnson',
    classId: 'class-1',
    className: 'Class 1',
    schoolName: 'Green Valley High School',
    rollNumber: '002',
    fatherName: 'Robert Johnson',
    motherName: 'Linda Johnson',
    phone1: '2345678901',
    phone2: '9876543210',
    address: '456 Oak Avenue',
    stsNumber: 'STS002',
    status: 'submitted',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'student-3',
    name: 'Michael Brown',
    classId: 'class-2',
    className: 'Class 2A',
    schoolName: 'Green Valley High School',
    rollNumber: '001',
    fatherName: 'David Brown',
    motherName: 'Susan Brown',
    phone1: '3456789012',
    phone2: '8765432109',
    address: '789 Pine Road',
    stsNumber: 'STS003',
    status: 'submitted',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getInitialData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    return {
      ...data,
      currentUser: null,
    };
  }
  
  // Initialize with default data
  const initialData: AppState = {
    users: [DEFAULT_ADMIN, DEFAULT_TEACHER],
    schools: [DEFAULT_SCHOOL],
    classes: DEFAULT_CLASSES,
    students: DEFAULT_STUDENTS,
    currentUser: null,
  };
  
  saveData(initialData);
  return initialData;
};

export const saveData = (state: AppState): void => {
  const { currentUser, ...dataToSave } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
};

export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
