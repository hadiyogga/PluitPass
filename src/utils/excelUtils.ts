import * as XLSX from 'xlsx';
import { Student } from '../contexts/DataContext';

export const importFromExcel = (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map Excel data to Student format
        const students: Student[] = jsonData.map((row: any, index) => ({
          id: row.id || Date.now().toString() + index,
          name: row.name || row.nama || '',
          nisn: row.nisn?.toString() || '',
          class: row.class || row.kelas || '',
          status: row.status || 'pending',
          score: row.score || row.nilai,
        }));
        
        resolve(students);
      } catch (error) {
        reject(new Error('Format file tidak valid'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };
    
    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (students: Student[]): void => {
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(students);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  // Generate file and trigger download
  XLSX.writeFile(workbook, 'data_siswa.xlsx');
};
