import React, { useState, useEffect } from 'react';
import { School, Class, Student,  AppState } from './types';

import { cn } from './utils/cn';
import LoginScreen from "./components/LoginScreen";

// Icons as simple SVG components
const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  ),
  GraduationCap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
};

type TabType = 'schools' | 'classes' | 'teachers' | 'students';

function App() {
  const [state, setState] = useState<AppState>({
  users: [],
  schools: [],
  classes: [],
  students: [],
  currentUser: null

});

useEffect(() => {
  const loadData = async () => {
    const [schools, classes, students, teachers] = await Promise.all([
      fetch("https://backend-render-6n5z.onrender.com/schools").then(r => r.json()),
      fetch("https://backend-render-6n5z.onrender.com/classes").then(r => r.json()),
      fetch("https://backend-render-6n5z.onrender.com/students").then(r => r.json()),
      fetch("https://backend-render-6n5z.onrender.com/teachers").then(r => r.json())
    ]);

    setState(prev => ({
      ...prev,
      schools,
      classes,
      students,
      users: teachers
    }));
  };

  loadData();
}, []);


  const [activeTab, setActiveTab] = useState<TabType>('schools');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  // Form states
  const [schoolForm, setSchoolForm] = useState({ name: '', address: '' });
  const [classForm, setClassForm] = useState({ name: '', schoolId: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', username: '', password: '', className: '' });
const [studentForm, setStudentForm] = useState({
  name: '',
  rollNumber: '',
  fatherName: '',
  motherName: '',
  phone1: '',
  phone2: '',
  address: '',
  stsNumber: '',
  dob: '',
  admissionNumber: '',
  bloodGroup: '',
  aadhar: ''
});

 useEffect(() => {
  fetch("https://backend-render-6n5z.onrender.com/students")
    .then(res => res.json())
    .then(data => {
      setState(prev => ({ ...prev, students: data }));
    });
}, []);

 const handleLogin = async (username: string, password: string) => {
  try {
    const res = await fetch("https://backend-render-6n5z.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    console.log("LOGIN SUCCESS:", data);

    setState(prev => ({
      ...prev,
      currentUser: data
    }));

  } catch (err) {
    console.error(err);
    setLoginError("Server error");
  }
};

  const handleLogout = () => {
    setState({ ...state, currentUser: null });
    setActiveTab('schools');
  };

  // Excel/CSV Download
  const downloadExcel = () => {
  try {
    if (!selectedSchool) {
      alert("Please select a school");
      return;
    }

    const filteredStudents = state.students.filter(
      s => s.schoolName === selectedSchool && s.status === 'submitted'
    );

    if (filteredStudents.length === 0) {
      alert("No data for selected school");
      return;
    }

    const headers = [
      'School Name',
      'Class Name',
      'Student Name',
      'Roll Number',
      'Father Name',
      'Mother Name',
      'Phone1',
      'Phone2',
      'Address',
      'STS Number',
      'DOB',
      'Admission Number',
      'Blood Group',
      'Aadhaar'
    ];

    let csvContent = headers.join(',') + '\n';

    filteredStudents.forEach(s => {
      const row = [
        s.schoolName || '-',
        s.className || '-',
        s.name,
        s.rollNumber,
        s.fatherName,
        s.motherName,
        `'${s.phone1}`,
        `'${s.phone2}`,
        s.address,
        `'${s.stsNumber}`,
        s.dob || '',
        `'${s.admissionNumber || ''}`,
        s.bloodGroup || '',
        `'${s.aadhar || ''}`
      ]
      .map(field => `"${String(field).replace(/"/g, '""')}"`)
      .join(',');

      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedSchool}_Students.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    alert("Error downloading file");
  }
};

  // School CRUD
const addSchool = async () => {
  try {
    const res = await fetch("https://backend-render-6n5z.onrender.com/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schoolForm)
    });

    const newSchool = await res.json();

    setState(prev => ({
      ...prev,
      schools: [...prev.schools, newSchool]
    }));

    // ✅ Reset form
    setSchoolForm({
      name: '',
      address: ''
    });

    // ✅ CLOSE MODAL (THIS WAS MISSING)
    setIsModalOpen(false);

  } catch (error) {
    console.error(error);
    alert("Error adding school");
  }
};

  const deleteSchool = (id: string) => {
    setState({
      ...state,
      schools: state.schools.filter(s => s.id !== id),
      classes: state.classes.filter(c => c.schoolId !== id),
    });
  };

  // Class CRUD
  const addClass = async () => {
  try {
    const res = await fetch("https://backend-render-6n5z.onrender.com/classes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(classForm)
    });

    const newClass = await res.json();

    setState(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));

    // ✅ Reset form
    setClassForm({
      name: '',
      schoolId: ''
    });

    // ✅ Close modal
    setIsModalOpen(false);

  } catch (error) {
    console.error(error);
    alert("Error adding class");
  }
};

  const deleteClass = (id: string) => {
    setState({
      ...state,
      classes: state.classes.filter(c => c.id !== id),
      students: state.students.filter(s => s.classId !== id),
    });
  };

  // Teacher CRUD
  const addTeacher = async () => {
  try {
    let classId = "";

    // 🔍 Check if class exists
    let existingClass = state.classes.find(
      c => c.name.toLowerCase() === teacherForm.className.toLowerCase()
    );

    // 🆕 If class doesn't exist → create in DB
    if (!existingClass) {
      const resClass = await fetch("https://backend-render-6n5z.onrender.com/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teacherForm.className,
          schoolId: state.schools[0]?.id || ""
        })
      });

      const newClass = await resClass.json();
      classId = newClass.id;

      // update frontend
      setState(prev => ({
        ...prev,
        classes: [...prev.classes, newClass]
      }));
    } else {
      classId = existingClass.id;
    }

    // 👨‍🏫 Create teacher in DB
    const resTeacher = await fetch("https://backend-render-6n5z.onrender.com/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: teacherForm.username,
        password: teacherForm.password,
        name: teacherForm.name,
        classId
      })
    });

    const newTeacher = await resTeacher.json();

    // 🔄 Update UI state
    setState(prev => ({
      ...prev,
      users: [...prev.users, newTeacher],
      classes: prev.classes.map(c =>
        c.id === classId ? { ...c, teacherId: newTeacher.id } : c
      )
    }));

    // 🧹 Reset form
    setTeacherForm({
      name: '',
      username: '',
      password: '',
      className: ''
    });

    setIsModalOpen(false);

  } catch (error) {
    console.error(error);
    alert("Error adding teacher");
  }
};

const deleteTeacher = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");

  if (!confirmDelete) return;

  try {
    await fetch(`https://backend-render-6n5z.onrender.com/teachers/${id}`, {
      method: "DELETE"
    });

    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));

  } catch (error) {
    console.error(error);
    alert("Error deleting teacher");
  }
};

  // Student CRUD
const addStudent = async () => {
  if (!state.currentUser?.classId) return;

  try {
    // Get class and school info
    const currentClass = state.classes.find(c => c.id === state.currentUser?.classId);
    const currentSchool = currentClass 
      ? state.schools.find(s => s.id === currentClass.schoolId) 
      : null;

    // Prepare data for backend
    const studentData = {
      ...studentForm,
      classId: state.currentUser.classId,
      className: currentClass?.name || '',
      schoolName: currentSchool?.name || '',
      status: 'draft'
    };

    // 🔥 SEND TO BACKEND
    const res = await fetch("https://backend-render-6n5z.onrender.com/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(studentData)
    });
    

    const savedStudent = await res.json();

    // 🔥 UPDATE FRONTEND STATE
    setState(prev => ({
      ...prev,
      students: [...prev.students, savedStudent]
    }));

    // Reset form
    setStudentForm({
      name: '',
      rollNumber: '',
      fatherName: '',
      motherName: '',
      phone1: '',
      phone2: '',
      address: '',
      stsNumber: '',
      dob: '',
      admissionNumber: '',
      bloodGroup: '',
      aadhar: ''
    });

    setIsModalOpen(false);

  } catch (error) {
    console.error(error);
    alert("Error saving student");
  }
};

const updateStudent = async () => {
  if (!editingItem) return;

  try {
    const res = await fetch(`https://backend-render-6n5z.onrender.com/students/${editingItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentForm)
    });

    const updated = await res.json();

    // ✅ Update state
    setState(prev => ({
      ...prev,
      students: prev.students.map(s =>
        s.id === updated.id ? updated : s
      )
    }));

    // ✅ Reset form
    setStudentForm({
      name: '',
      rollNumber: '',
      fatherName: '',
      motherName: '',
      phone1: '',
      phone2: '',
      address: '',
      stsNumber: '',
      dob: '',
      admissionNumber: '',
      bloodGroup: '',
      aadhar: ''
    });

    // ✅ Close modal
    setEditingItem(null);
    setIsModalOpen(false);

  } catch (error) {
    console.error(error);
    alert("Error updating student");
  }
};
const deleteStudent = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this student?");

  if (!confirmDelete) return;

  try {
    await fetch(`https://backend-render-6n5z.onrender.com/students/${id}`, {
      method: "DELETE"
    });

    setState(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== id)
    }));

  } catch (error) {
    console.error(error);
    alert("Error deleting student");
  }
};

  // Submit all draft students for teacher's class
  const submitAllStudents = () => {
    if (!state.currentUser?.classId) return;
    
    const submittedAt = new Date().toISOString();
    setState({
      ...state,
      students: state.students.map(s => 
        s.classId === state.currentUser?.classId && s.status === 'draft'
          ? { ...s, status: 'submitted' as const, submittedAt }
          : s
      ),
    });
  };

const openEditStudent = (student: Student) => {
  setEditingItem(student);

  setStudentForm({
    name: student.name,
    rollNumber: student.rollNumber,
    fatherName: student.fatherName,
    motherName: student.motherName,
    phone1: student.phone1,
    phone2: student.phone2,
    address: student.address,
    stsNumber: student.stsNumber,
    dob: student.dob || '',
    admissionNumber: student.admissionNumber || '',
    bloodGroup: student.bloodGroup || '',
    aadhar: student.aadhar || ''
  });

  setIsModalOpen(true);
};

  // Filter functions
  const getFilteredStudents = (showDraftOnly: boolean = false) => {
    let students = state.students;
    
    if (state.currentUser?.role === 'teacher' && state.currentUser.classId) {
      students = students.filter(s => s.classId === state.currentUser?.classId);
    }
    
    if (showDraftOnly) {
      students = students.filter(s => s.status === 'draft');
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      students = students.filter(s => 
        s.name.toLowerCase().includes(term) ||
        s.rollNumber.toLowerCase().includes(term) ||
        s.fatherName.toLowerCase().includes(term) ||
        s.stsNumber.toLowerCase().includes(term)
      );
    }
    
    return students;
  };

  // Get count of draft students for teacher's class
  const getDraftStudentCount = () => {
    if (!state.currentUser?.classId) return 0;
    return state.students.filter(s => 
      s.classId === state.currentUser?.classId && s.status === 'draft'
    ).length;
  };

  // Get count of submitted students for teacher's class
  const getSubmittedStudentCount = () => {
    if (!state.currentUser?.classId) return 0;
    return state.students.filter(s => 
      s.classId === state.currentUser?.classId && s.status === 'submitted'
    ).length;
  };

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return 'Not Assigned';
    const teacher = state.users.find(u => u.id === teacherId);
    return teacher?.name || 'Unknown';
  };

  const getClassName = (classId: string) => {
    const cls = state.classes.find(c => c.id === classId);
    return cls?.name || 'Unknown';
  };

  // const getSchoolName = (schoolId: string) => {
  //   const school = state.schools.find(s => s.id === schoolId);
  //   return school?.name || 'Unknown';
  // };

  // Render login screen
  if (!state.currentUser) {
    return (
      <LoginScreen onLogin={handleLogin} error={loginError} />
    );
  }

  // Render teacher view
  if (state.currentUser.role === 'teacher') {
    const teacherClass = state.classes.find(c => c.id === state.currentUser?.classId);
    const draftCount = getDraftStudentCount();
    const submittedCount = getSubmittedStudentCount();

    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Icons.GraduationCap />
              <h1 className="text-xl font-bold">Teacher Dashboard</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <span className="text-blue-100 text-sm sm:text-base">
                Welcome, {state.currentUser.name} | Class: {teacherClass?.name || 'Not Assigned'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <Icons.LogOut />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
              <div className="text-yellow-800 font-semibold">Draft Students</div>
              <div className="text-3xl font-bold text-yellow-900">{draftCount}</div>
              <div className="text-sm text-yellow-700">Not yet submitted</div>
            </div>
            <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
              <div className="text-green-800 font-semibold">Submitted Students</div>
              <div className="text-3xl font-bold text-green-900">{submittedCount}</div>
              <div className="text-sm text-green-700">Sent to Admin</div>
            </div>
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
              <div className="text-blue-800 font-semibold">Total Students</div>
              <div className="text-3xl font-bold text-blue-900">{draftCount + submittedCount}</div>
              <div className="text-sm text-blue-700">In your class</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">My Students</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search />
                </span>
              </div>
              {draftCount > 0 && (
                <button
                  onClick={submitAllStudents}
                  className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold w-full sm:w-auto"
                >
                  <Icons.Check />
                  Final Submit All ({draftCount})
                </button>
              )}
              <button
                onClick={() => {
                  setEditingItem(null);
                  setStudentForm({
  name: '',
  rollNumber: '',
  fatherName: '',
  motherName: '',
  phone1: '',
  phone2: '',
  address: '',
  stsNumber: '',
  dob: '',
  admissionNumber: '',
  bloodGroup: '',
  aadhar: ''
});
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <Icons.Plus />
                Add Student
              </button>
            </div>
          </div>

          {/* Show message if no students */}
          {getFilteredStudents().length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-500 text-lg">No students found.</div>
              <div className="text-gray-400">Add students using the button above.</div>
            </div>
          ) : (
            <StudentTable
              students={getFilteredStudents()}
              onEdit={openEditStudent}
              onDelete={deleteStudent}
              getClassName={getClassName}
              showStatus={true}
              teacherView={true}
            />
          )}

          {/* Student Modal */}
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Student' : 'Add Student'}>
              <StudentForm
                form={studentForm}
                setForm={setStudentForm}
                onSubmit={editingItem ? updateStudent : addStudent}
                onCancel={() => setIsModalOpen(false)}
                isEdit={!!editingItem}
              />
            </Modal>
          )}
        </main>
      </div>
    );
  }

  // Render admin view
  const tabs: { id: TabType; label: string; icon: React.ReactElement }[] = [
    { id: 'schools', label: 'Schools', icon: <Icons.Building /> },
    { id: 'classes', label: 'Classes', icon: <Icons.BookOpen /> },
    { id: 'teachers', label: 'Teachers', icon: <Icons.User /> },
    { id: 'students', label: 'Students', icon: <Icons.Users /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Icons.GraduationCap />
            <h1 className="text-xl font-bold">School Management System</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <span className="text-indigo-100 text-sm sm:text-base">Welcome, {state.currentUser.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              <Icons.LogOut />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-t-lg transition-colors text-sm sm:text-base",
                activeTab === tab.id
                  ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Schools</h2>
              <button
                onClick={() => {
                  setSchoolForm({ name: '', address: '' });
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <Icons.Plus />
                Add School
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {state.schools.map(school => (
                <div key={school.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{school.name}</h3>
                      <p className="text-gray-600 mt-1">{school.address}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {state.classes.filter(c => c.schoolId === school.id).length} Classes
                      </p>
                    </div>
                    <button
                      onClick={() => deleteSchool(school.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {isModalOpen && (
              <Modal onClose={() => setIsModalOpen(false)} title="Add School">
                <form onSubmit={(e) => { e.preventDefault(); addSchool(); }}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="School Name"
                      value={schoolForm.name}
                      onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={schoolForm.address}
                      onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
                      >
                        Add School
                      </button>
                    </div>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
  <h2 className="text-2xl font-bold text-gray-800">Classes</h2>

  <div className="relative">
    <input
      type="text"
      placeholder="Search classes..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <Icons.Search />
    </span>
  </div>
</div>
              <button
                onClick={() => {
                  setClassForm({ name: '', schoolId: state.schools[0]?.id || '' });
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <Icons.Plus />
                Add Class
              </button>
            </div>
            {state.schools.map(school => {
  const classes = state.classes.filter(c => c.schoolId === school.id);

  if (classes.length === 0) return null;

  return (
    <div key={school.id} className="mb-8">
      {/* School Name */}
      <h3 className="text-lg font-bold text-indigo-600 mb-2">
        {school.name}
      </h3>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[800px] w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Class Name</th>
              <th className="px-6 py-3 text-left">Teacher</th>
              <th className="px-6 py-3 text-left">Students</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {classes
              .filter(cls =>
                cls.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cls.name}</td>
                  <td className="px-6 py-4">
                    {getTeacherName(cls.teacherId)}
                  </td>
                  <td className="px-6 py-4">
                    {state.students.filter(s => s.classId === cls.id).length}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteClass(cls.id)}
                      className="text-red-500"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
})}
            {isModalOpen && (
              <Modal onClose={() => setIsModalOpen(false)} title="Add Class">
                <form onSubmit={(e) => { e.preventDefault(); addClass(); }}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Class Name (e.g., Class 1, 2A)"
                      value={classForm.name}
                      onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <select
                      value={classForm.schoolId}
                      onChange={(e) => setClassForm({ ...classForm, schoolId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select School</option>
                      {state.schools.map(school => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                      ))}
                    </select>
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
                      >
                        Add Class
                      </button>
                    </div>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
  <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>

  <div className="relative">
    <input
      type="text"
      placeholder="Search teachers..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <Icons.Search />
    </span>
  </div>
</div>
              <button
                onClick={() => {
                  setTeacherForm({ name: '', username: '', password: '', className: '' });
                  setIsModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <Icons.Plus />
                Add Teacher
              </button>
            </div>
            {state.schools.map(school => {
  const schoolClasses = state.classes.filter(c => c.schoolId === school.id);

  const teachers = state.users
    .filter(u => u.role === 'teacher')
    .filter(t =>
      schoolClasses.some(c => c.id === t.classId)
    );

  if (teachers.length === 0) return null;

  return (
    <div key={school.id} className="mb-8">
      {/* School Name */}
      <h3 className="text-lg font-bold text-indigo-600 mb-2">
        {school.name}
      </h3>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-[800px] w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Password</th>
              <th className="px-6 py-3 text-left">Assigned Class</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {teachers
              .filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(teacher => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {teacher.username}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {teacher.password}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {getClassName(teacher.classId || '')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteTeacher(teacher.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
})}
            {isModalOpen && (
              <Modal onClose={() => setIsModalOpen(false)} title="Add Teacher">
                <form onSubmit={(e) => { e.preventDefault(); addTeacher(); }}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Teacher Name"
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={teacherForm.username}
                      onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={teacherForm.password}
                      onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Class Name (e.g., Class 1, Class 2A)"
                      value={teacherForm.className}
                      onChange={(e) => setTeacherForm({ ...teacherForm, className: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
                      >
                        Create Teacher
                      </button>
                    </div>
                  </div>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Submitted Students</h2>
                <p className="text-gray-500 text-sm mt-1">Only showing students submitted by teachers</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* 👇 ADD THIS DROPDOWN */}
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                >
                  <option value="">Select School</option>
                  {state.schools.map(school => (
                    <option key={school.id} value={school.name}>
                      {school.name}
                    </option>
                  ))}
                </select>

                {/* EXISTING BUTTON */}
                <button
                  onClick={downloadExcel}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                >
                  Download CSV
                </button>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icons.Search />
                  </span>
                </div>
              </div>
            </div>
            {/* Admin can only see submitted students - grouped by school and class */}
            {(() => {
              const submittedStudents = state.students.filter(s => s.status === 'submitted');
              
              // Apply search filter
              const filteredStudents = submittedStudents.filter(s => {
                if (!searchTerm) return true;
                const term = searchTerm.toLowerCase();
                return (
                  s.name.toLowerCase().includes(term) ||
                  s.rollNumber.toLowerCase().includes(term) ||
                  s.fatherName.toLowerCase().includes(term) ||
                  s.stsNumber.toLowerCase().includes(term) ||
                  s.className.toLowerCase().includes(term) ||
                  s.schoolName.toLowerCase().includes(term)
                );
              });

              // Group by school then by class
              const schoolGroups: { [schoolId: string]: { school: School; classes: { [classId: string]: { class: Class; students: Student[] } } } } = {};
              
              filteredStudents.forEach(student => {
                const cls = state.classes.find(c => c.name === student.className);
                if (!cls) return;
                
                const school = state.schools.find(s => s.id === cls.schoolId);
                if (!school) return;
                
                if (!schoolGroups[school.id]) {
                  schoolGroups[school.id] = { school, classes: {} };
                }
                if (!schoolGroups[school.id].classes[cls.id]) {
                  schoolGroups[school.id].classes[cls.id] = { class: cls, students: [] };
                }
                schoolGroups[school.id].classes[cls.id].students.push(student);
              });

              if (Object.keys(schoolGroups).length === 0) {
                return (
                  <div className="text-center py-12 text-gray-500">
                    <Icons.Users />
                    <p className="mt-2">No submitted student data available</p>
                  </div>
                );
              }

              return (
                <div className="space-y-8">
                  {Object.values(schoolGroups).map(({ school, classes }) => (
                    <div key={school.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      {/* School Header */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Icons.Building />
                          {school.name}
                        </h3>
                      </div>
                      
                      {/* Classes */}
                      <div className="divide-y divide-gray-100">
                        {Object.values(classes).map(({ class: cls, students: classStudents }) => (
                          <div key={cls.id} className="p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Icons.BookOpen />
                              {cls.name}
                              <span className="text-sm font-normal text-gray-500 ml-2">
                                ({classStudents.length} student{classStudents.length !== 1 ? 's' : ''})
                              </span>
                            </h4>
                            
                            <StudentTable
                              students={classStudents}
                              onEdit={openEditStudent}
                              onDelete={deleteStudent}
                              getClassName={getClassName}
                              showClassSchool={false}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {isModalOpen && editingItem && (
              <Modal onClose={() => { setIsModalOpen(false); setEditingItem(null); }} title="Edit Student">
                <StudentForm
                  form={studentForm}
                  setForm={setStudentForm}
                  onSubmit={updateStudent}
                  onCancel={() => { setIsModalOpen(false); setEditingItem(null); }}
                  isEdit={true}
                />
              </Modal>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



// Modal Component
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icons.X />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Student Table Component
function StudentTable({ 
  students, 
  onEdit, 
  onDelete, 
  getClassName,
  showStatus = false,
  teacherView = false,
  showClassSchool = false
}: { 
  students: Student[]; 
  onEdit: (s: Student) => void; 
  onDelete: (id: string) => void;
  getClassName: (id: string) => string;
  showStatus?: boolean;
  teacherView?: boolean;
  showClassSchool?: boolean;
}) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Icons.Users />
        </div>
        <h3 className="text-lg font-medium text-gray-800">No Students Found</h3>
        <p className="text-gray-500 mt-1">Add students to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No.</th>
              {teacherView && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>}
              {showClassSchool && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>}
              {showClassSchool && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Father's Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mother's Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">STS Number</th>
              {showStatus && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map(student => (
              <tr key={student.id} className={student.status === 'draft' ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                <td className="px-6 py-4 text-gray-600">{student.rollNumber}</td>
                {teacherView && <td className="px-6 py-4 text-gray-600">{getClassName(student.classId)}</td>}
                {showClassSchool && <td className="px-6 py-4 text-gray-600">{student.className}</td>}
                {showClassSchool && <td className="px-6 py-4 text-gray-600">{student.schoolName}</td>}
                <td className="px-6 py-4 text-gray-600">{student.fatherName}</td>
                <td className="px-6 py-4 text-gray-600">{student.motherName}</td>
                <td className="px-6 py-4 text-gray-600">{student.phone1}</td>
                <td className="px-6 py-4 text-gray-600">{student.stsNumber}</td>
                {showStatus && (
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      student.status === 'submitted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status === 'submitted' ? 'Submitted' : 'Draft'}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Student Form Component
function StudentForm({ 
  form, 
  setForm, 
  onSubmit, 
  onCancel,
  isEdit 
}: { 
  form: any; 
  setForm: (f: any) => void; 
  onSubmit: () => void; 
  onCancel: () => void;
  isEdit: boolean;
}) {
  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
          <input
            type="text"
            value={form.rollNumber}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
            <input
              type="text"
              value={form.fatherName}
              onChange={(e) => handleChange('fatherName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name *</label>
            <input
              type="text"
              value={form.motherName}
              onChange={(e) => handleChange('motherName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 1 *</label>
            <input
  type="tel"
  value={form.phone1}
  maxLength={10}
  pattern="[0-9]{10}"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("phone1", value);
  }}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  required
/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2</label>
            <input
  type="tel"
  value={form.phone2}
  maxLength={10}
  pattern="[0-9]{10}"
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    handleChange("phone2", value);
  }}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <textarea
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">STS Number *</label>
          <input
  type="text"
  value={form.stsNumber}
  maxLength={11}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // only digits

    // Format as XXX-XXX-XXX
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) +
        "-" +
        value.slice(3, 6) +
        "-" +
        value.slice(6, 9);
    }

    handleChange("stsNumber", value);
  }}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* DOB */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Date of Birth *
    </label>
    <input
      type="date"
      value={form.dob}
      onChange={(e) => handleChange("dob", e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>

  {/* Admission Number */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Admission Number *
    </label>
    <input
      type="text"
      value={form.admissionNumber}
      onChange={(e) => handleChange("admissionNumber", e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Blood Group */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Blood Group *
    </label>
    <select
      value={form.bloodGroup}
      onChange={(e) => handleChange("bloodGroup", e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    >
      <option value="">Select</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
    </select>
  </div>

  {/* Aadhaar Number */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Aadhaar Number *
    </label>
    <input
      type="text"
      value={form.aadhar}
      maxLength={12}
      pattern="[0-9]{12}"
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        handleChange("aadhar", value);
      }}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
</div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
          >
            {isEdit ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </div>
    </form>
  );
}



export default App;
