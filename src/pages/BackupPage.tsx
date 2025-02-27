import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { useData } from '../contexts/DataContext';
import { Check, Download, Upload } from 'lucide-react';

const BackupPage = () => {
  const { exportData, importData } = useData();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleExport = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `pluitpass_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = importData(jsonData);
        
        if (success) {
          setImportStatus('success');
          setStatusMessage('Data berhasil diimpor!');
        } else {
          setImportStatus('error');
          setStatusMessage('Terjadi kesalahan saat mengimpor data.');
        }
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setImportStatus('idle');
          setStatusMessage('');
        }, 3000);
      } catch (error) {
        setImportStatus('error');
        setStatusMessage('Format file tidak valid.');
        
        setTimeout(() => {
          setImportStatus('idle');
          setStatusMessage('');
        }, 3000);
      }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Backup & Restore</h1>
        
        {importStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-md ${
            importStatus === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center">
              {importStatus === 'success' && <Check size={18} className="mr-2" />}
              {statusMessage}
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Backup Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Download size={24} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Backup Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Unduh backup data aplikasi dalam format JSON. 
              File ini berisi seluruh data siswa dan pengaturan aplikasi.
            </p>
            
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <Download size={18} className="mr-2" />
              Unduh Backup
            </button>
          </div>
          
          {/* Restore Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Upload size={24} className="text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Restore Data</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Pulihkan data dari file backup JSON yang telah Anda unduh sebelumnya.
              Perhatikan bahwa tindakan ini akan menimpa data yang ada.
            </p>
            
            <label className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center cursor-pointer">
              <Upload size={18} className="mr-2" />
              Pilih File Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Informasi Penting</h2>
          
          <div className="text-gray-600 space-y-2">
            <p>
              <strong>Backup secara berkala:</strong> Lakukan backup data secara rutin untuk menghindari kehilangan data.
            </p>
            <p>
              <strong>Keamanan data:</strong> Simpan file backup di tempat yang aman, karena file tersebut berisi semua informasi aplikasi Anda.
            </p>
            <p>
              <strong>Kompatibilitas:</strong> File backup hanya dapat dipulihkan pada versi aplikasi yang sama.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BackupPage;
