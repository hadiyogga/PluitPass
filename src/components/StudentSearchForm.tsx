import { useState } from 'react';
import { useData, Student } from '../contexts/DataContext';
import { Search } from 'lucide-react';

const StudentSearchForm = () => {
  const { students, settings } = useData();
  const [nisn, setNisn] = useState('');
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nisn.trim()) {
      setError('Silakan masukkan NISN');
      return;
    }

    const result = students.find(student => student.nisn === nisn.trim());
    setSearchResult(result || null);
    setError(result ? '' : 'Data siswa tidak ditemukan');
    setHasSearched(true);
  };

  const renderStatus = (status: 'passed' | 'failed' | 'pending') => {
    if (!settings.showResults) {
      return (
        <div className="text-gray-500">
          Hasil belum dapat ditampilkan
        </div>
      );
    }

    switch (status) {
      case 'passed':
        return (
          <div className="text-green-600 font-bold text-lg">
            LULUS
          </div>
        );
      case 'failed':
        return (
          <div className="text-red-600 font-bold text-lg">
            TIDAK LULUS
          </div>
        );
      default:
        return (
          <div className="text-gray-500">
            Sedang diproses
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Masukkan NISN Anda"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Cek Kelulusan
        </button>
      </form>

      {hasSearched && searchResult && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Hasil Pencarian</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 block">Nama:</span>
              <span className="font-semibold">{searchResult.name}</span>
            </div>
            <div>
              <span className="text-gray-600 block">NISN:</span>
              <span className="font-semibold">{searchResult.nisn}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Kelas:</span>
              <span className="font-semibold">{searchResult.class}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Status:</span>
              {renderStatus(searchResult.status)}
            </div>
            {settings.showResults && searchResult.score && (
              <div>
                <span className="text-gray-600 block">Nilai:</span>
                <span className="font-semibold">{searchResult.score}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasSearched && !searchResult && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600">
            Maaf, data siswa dengan NISN tersebut tidak ditemukan. Silakan periksa kembali NISN Anda.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSearchForm;
