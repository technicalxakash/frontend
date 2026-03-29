// Types for School Management System

export type Role = 'admin' | 'teacher';

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
  schoolId?: string;
  classId?: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  schoolId: string;
  teacherId?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  className: string;
  schoolName: string;
  rollNumber: string;
  fatherName: string;
  motherName: string;
  phone1: string;
  phone2: string;
  address: string;
  dob?: string;
admissionNumber?: string;
bloodGroup?: string;
aadhar?: string;
  stsNumber: string;
  status: 'draft' | 'submitted';
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  users: User[];
  schools: School[];
  classes: Class[];
  students: Student[];
  currentUser: User | null;
}
