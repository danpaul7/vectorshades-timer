import React, { useState, useEffect } from 'react';

function convertDecimalHoursToText(decimalHours) {
  const clampedHours = Math.max(0, decimalHours); // Prevent negative display
  const totalSeconds = Math.floor(clampedHours * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  return `${hours} Hour${hours !== 1 ? 's' : ''} ${paddedMinutes} Minute${minutes !== 1 ? 's' : ''} ${paddedSeconds} Second${seconds !== 1 ? 's' : ''}`;
}

const LiveHourTimer = ({ initialHours, maxHours , pauseTask }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const totalUsed = initialHours + (prev + 1) / 3600;
        if (totalUsed >= maxHours) {
          clearInterval(interval);
          return prev; // Stop at max
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialHours, maxHours]);

  const remainingDecimal = Math.max(0, maxHours - (initialHours + elapsedSeconds / 3600));


  useEffect(() => {
    if(remainingDecimal === 0) pauseTask()
  }, [remainingDecimal])
  

  return (
    <div className="remaining-time">
      {convertDecimalHoursToText(remainingDecimal)}
    </div>
  );
};

export default LiveHourTimer;
