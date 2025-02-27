import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import StudentSearchForm from '../components/StudentSearchForm';
import { useData } from '../contexts/DataContext';

const HomePage = () => {
  const { settings } = useData();
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={settings.logoUrl} 
              alt="Logo Sekolah" 
              className="h-12 w-12 rounded-full bg-white p-1 mr-3" 
            />
            <h1 className="text-xl md:text-2xl font-bold">{settings.schoolName}</h1>
          </div>
          <Link 
            to="/login" 
            className="text-white bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-md text-sm font-medium"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pengumuman Kelulusan
            </h1>
            <p className="text-gray-600 mb-6">
              Tahun Ajaran {settings.schoolYear}
            </p>

            {/* Countdown Timer */}
            <div className="mb-10">
              <Countdown />
            </div>
          </div>

          {/* Student Search Form */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Cek Status Kelulusan
            </h2>
            <StudentSearchForm />
          </div>

          {/* Information */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Informasi</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                1. Pastikan Anda memasukkan NISN dengan benar untuk melihat hasil kelulusan.
              </p>
              <p>
                2. Pengumuman resmi akan dirilis pada tanggal {new Date(settings.announcementDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}.
              </p>
              <p>
                3. {settings.additionalInfo}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} {settings.schoolName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
