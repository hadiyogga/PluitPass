import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { useData } from '../contexts/DataContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const { settings } = useData();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(settings.announcementDate);
      const now = new Date();
      const diff = differenceInSeconds(targetDate, now);

      if (diff <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (60 * 60 * 24));
      const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = Math.floor(diff % 60);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.announcementDate]);

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">
        {isExpired ? 'Pengumuman telah dirilis!' : 'Pengumuman akan dirilis dalam:'}
      </h2>
      
      {!isExpired && (
        <div className="flex justify-center gap-4">
          <div className="bg-white p-3 rounded-lg shadow-md w-20">
            <div className="text-3xl font-bold text-blue-600">{timeLeft.days}</div>
            <div className="text-gray-600 text-sm">Hari</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md w-20">
            <div className="text-3xl font-bold text-blue-600">{timeLeft.hours}</div>
            <div className="text-gray-600 text-sm">Jam</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md w-20">
            <div className="text-3xl font-bold text-blue-600">{timeLeft.minutes}</div>
            <div className="text-gray-600 text-sm">Menit</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md w-20">
            <div className="text-3xl font-bold text-blue-600">{timeLeft.seconds}</div>
            <div className="text-gray-600 text-sm">Detik</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countdown;
