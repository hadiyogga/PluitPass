import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { useData } from '../contexts/DataContext';
import { Save } from 'lucide-react';

const SettingsPage = () => {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState({
    schoolName: settings.schoolName,
    announcementDate: new Date(settings.announcementDate).toISOString().split('T')[0],
    showResults: settings.showResults,
    logoUrl: settings.logoUrl,
    schoolYear: settings.schoolYear || '2024/2025',
    additionalInfo: settings.additionalInfo || ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateSettings({
      schoolName: formData.schoolName,
      announcementDate: new Date(formData.announcementDate).toISOString(),
      showResults: formData.showResults,
      logoUrl: formData.logoUrl,
      schoolYear: formData.schoolYear,
      additionalInfo: formData.additionalInfo
    });
    
    setSaveMessage('Pengaturan berhasil disimpan!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Pengaturan</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            {saveMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                {saveMessage}
              </div>
            )}
            
            <div className="grid gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  placeholder="2024/2025"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData({...formData, schoolYear: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Pengumuman
                </label>
                <input
                  type="date"
                  value={formData.announcementDate}
                  onChange={(e) => setFormData({...formData, announcementDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Logo Sekolah
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Masukkan URL gambar untuk logo sekolah
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Informasi Tambahan
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Masukkan informasi tambahan untuk ditampilkan pada halaman utama"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showResults"
                  checked={formData.showResults}
                  onChange={(e) => setFormData({...formData, showResults: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showResults" className="ml-2 block text-sm text-gray-700">
                  Tampilkan Hasil Kelulusan (aktifkan ini saat pengumuman)
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-end">
              <div className="flex items-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="mr-2 -ml-1 h-5 w-5" />
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Pengaturan Lanjutan</h2>
          
          <div className="border-t pt-4">
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Reset Aplikasi</h3>
              <p className="text-sm text-gray-500 mb-2">
                Menghapus seluruh data siswa dan mengembalikan pengaturan ke default.
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
              >
                Reset Semua Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
