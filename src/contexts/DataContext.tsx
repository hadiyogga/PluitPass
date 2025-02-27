import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  nisn: string;
  class: string;
  status: 'passed' | 'failed' | 'pending';
  score?: number;
}

export interface AppSettings {
  schoolName: string;
  announcementDate: string;
  showResults: boolean;
  logoUrl: string;
  schoolYear: string;
  additionalInfo: string;
}

interface DataContextType {
  students: Student[];
  settings: AppSettings;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  setAllStudents: (students: Student[]) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const defaultSettings: AppSettings = {
  schoolName: 'SMP REMAJA PLUIT',
  announcementDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  showResults: false,
  logoUrl: 'https://via.placeholder.com/150',
  schoolYear: '2024/2025',
  additionalInfo: 'Untuk informasi lebih lanjut, silakan hubungi pihak sekolah melalui nomor telepon (021) 6620123 atau email info@remajapluit.sch.id.'
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    // Load data from localStorage
    const savedStudents = localStorage.getItem('students');
    const savedSettings = localStorage.getItem('settings');

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Handle migrating old settings without new fields
      if (!parsedSettings.schoolYear) {
        parsedSettings.schoolYear = defaultSettings.schoolYear;
      }
      if (!parsedSettings.additionalInfo) {
        parsedSettings.additionalInfo = defaultSettings.additionalInfo;
      }
      setSettings(parsedSettings);
    } else {
      // Initialize with default settings if none exist
      localStorage.setItem('settings', JSON.stringify(defaultSettings));
    }
  }, []);

  // Save students to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, updatedData: Partial<Student>) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, ...updatedData } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const setAllStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const exportData = () => {
    const data = {
      students,
      settings,
    };
    return JSON.stringify(data);
  };

  const importData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.students && Array.isArray(data.students)) {
        setStudents(data.students);
      }
      if (data.settings) {
        // Ensure backward compatibility with older exported data
        const updatedSettings = {
          ...settings,
          ...data.settings,
          schoolYear: data.settings.schoolYear || defaultSettings.schoolYear,
          additionalInfo: data.settings.additionalInfo || defaultSettings.additionalInfo
        };
        setSettings(updatedSettings);
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        students,
        settings,
        addStudent,
        updateStudent,
        deleteStudent,
        setAllStudents,
        updateSettings,
        exportData,
        importData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
