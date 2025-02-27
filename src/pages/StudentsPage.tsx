import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { useData, Student } from '../contexts/DataContext';
import { importFromExcel, exportToExcel } from '../utils/excelUtils';
import { Check, Download, Pencil, Search, Trash, Upload, X } from 'lucide-react';

const StudentsPage = () => {
  const { students, addStudent, updateStudent, deleteStudent, setAllStudents } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed' | 'pending'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    class: '',
    status: 'pending' as 'passed' | 'failed' | 'pending',
    score: ''
  });

  // Filtered students
  const filteredStudents = students
    .filter(student => {
      // Filter by status
      if (filter !== 'all') {
        return student.status === filter;
      }
      return true;
    })
    .filter(student => {
      // Search by name or NISN
      const searchLower = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(searchLower) ||
        student.nisn.toLowerCase().includes(searchLower) ||
        student.class.toLowerCase().includes(searchLower)
      );
    });

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      nisn: '',
      class: '',
      status: 'pending',
      score: ''
    });
    setEditingStudent(null);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentData = {
      name: formData.name,
      nisn: formData.nisn,
      class: formData.class,
      status: formData.status,
      score: formData.score ? Number(formData.score) : undefined
    };
    
    if (editingStudent) {
      updateStudent(editingStudent.id, studentData);
    } else {
      addStudent(studentData);
    }
    
    resetForm();
    setShowAddForm(false);
  };

  // Handle edit button click
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      nisn: student.nisn,
      class: student.class,
      status: student.status,
      score: student.score?.toString() || ''
    });
    setShowAddForm(true);
  };

  // Handle delete button click
  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      deleteStudent(id);
    }
  };

  // Handle file import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const importedStudents = await importFromExcel(file);
      if (window.confirm(`Import ${importedStudents.length} data siswa?`)) {
        setAllStudents(importedStudents);
      }
    } catch (error) {
      alert(`Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // Reset file input
    e.target.value = '';
  };

  // Handle file export
  const handleExport = () => {
    exportToExcel(students);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          
          <div className="flex space-x-2">
            <label className="relative inline-block bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md overflow-hidden cursor-pointer">
              <span className="flex items-center px-3 py-2">
                <Upload size={16} className="mr-1" />
                Import Excel
              </span>
              <input 
                type="file" 
                accept=".xlsx,.xls" 
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleImport}
              />
            </label>
            
            <button
              onClick={handleExport}
              className="bg-green-50 hover:bg-green-100 text-green-700 font-medium px-3 py-2 rounded-md flex items-center"
            >
              <Download size={16} className="mr-1" />
              Export Excel
            </button>
            
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
            >
              Tambah Siswa
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau NISN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'passed' | 'failed' | 'pending')}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Semua Status</option>
                <option value="passed">Lulus</option>
                <option value="failed">Tidak Lulus</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Add/Pencil Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-medium mb-4">
              {editingStudent ? 'Pencil Data Siswa' : 'Tambah Data Siswa'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NISN
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({...formData, nisn: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'passed' | 'failed' | 'pending'})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="passed">Lulus</option>
                    <option value="failed">Tidak Lulus</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nilai (Opsional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => setFormData({...formData, score: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NISN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.nisn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.status === 'passed'
                              ? 'bg-green-100 text-green-800'
                              : student.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {student.status === 'passed' && <Check size={12} className="mr-1" />}
                          {student.status === 'failed' && <X size={12} className="mr-1" />}
                          {student.status === 'passed'
                            ? 'Lulus'
                            : student.status === 'failed'
                            ? 'Tidak Lulus'
                            : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.score !== undefined ? student.score : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'Tidak ada data siswa yang sesuai dengan filter'
                : 'Belum ada data siswa. Silakan tambahkan data siswa baru.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentsPage;
