import AdminNavbar from '../components/AdminNavbar';
import { useData } from '../contexts/DataContext';
import { Check, Clock, Users, X } from 'lucide-react';

const DashboardPage = () => {
  const { students, settings } = useData();
  
  const passedCount = students.filter(s => s.status === 'passed').length;
  const failedCount = students.filter(s => s.status === 'failed').length;
  const pendingCount = students.filter(s => s.status === 'pending').length;
  
  const statsCards = [
    {
      title: 'Total Siswa',
      value: students.length,
      icon: <Users size={24} className="text-blue-500" />,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Lulus',
      value: passedCount,
      icon: <Check size={24} className="text-green-500" />,
      color: 'bg-green-50 text-green-700'
    },
    {
      title: 'Tidak Lulus',
      value: failedCount,
      icon: <X size={24} className="text-red-500" />,
      color: 'bg-red-50 text-red-700'
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: <Clock size={24} className="text-yellow-500" />,
      color: 'bg-yellow-50 text-yellow-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-medium mb-4">Informasi Sekolah</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nama Sekolah:</p>
              <p className="font-medium">{settings.schoolName}</p>
            </div>
            <div>
              <p className="text-gray-600">Tahun Ajaran:</p>
              <p className="font-medium">{settings.schoolYear}</p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal Pengumuman:</p>
              <p className="font-medium">
                {new Date(settings.announcementDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Status Tampilkan Hasil:</p>
              <p className={`font-medium ${settings.showResults ? 'text-green-600' : 'text-red-600'}`}>
                {settings.showResults ? 'Aktif' : 'Tidak Aktif'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-600">{card.title}</h3>
                {card.icon}
              </div>
              <p className={`text-3xl font-bold ${card.color.split(' ')[1]}`}>
                {card.value}
              </p>
              <div className={`mt-2 text-xs px-2 py-1 rounded ${card.color}`}>
                {Math.round((card.value / (students.length || 1)) * 100)}% dari total
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Siswa Terbaru</h2>
          
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.slice(0, 5).map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.nisn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            student.status === 'passed'
                              ? 'bg-green-100 text-green-800'
                              : student.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {student.status === 'passed'
                            ? 'Lulus'
                            : student.status === 'failed'
                            ? 'Tidak Lulus'
                            : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Belum ada data siswa. Tambahkan data siswa melalui menu Data Siswa.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
