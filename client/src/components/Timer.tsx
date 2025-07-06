import React, { useState, useEffect } from 'react';

function convertDecimalHoursToText(decimalHours) {
  const totalSeconds = Math.floor(decimalHours * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  return `${hours} Hour${hours !== 1 ? 's' : ''} ${paddedMinutes} Minute${minutes !== 1 ? 's' : ''} ${paddedSeconds} Second${seconds !== 1 ? 's' : ''}`;
}

const LiveHourTimer = ({ initialHours }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const currentDecimal = initialHours + elapsedSeconds / 3600;

  return (
    <div className="current-time">
      {convertDecimalHoursToText(currentDecimal)}
    </div>
  );
};

export default LiveHourTimer