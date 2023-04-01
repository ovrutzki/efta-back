import moment from 'moment-timezone';

function runFunctionEveryFiveMinutes() {
  const timeZone = 'Asia/Jerusalem'; // Set the time zone to Israel
  const startTime = moment.tz('10:00', 'HH:mm', timeZone);
  const endTime = moment.tz('11:00', 'HH:mm', timeZone);
  const interval = 5 * 60 * 1000; // 5 minutes in milliseconds

  const intervalId = setInterval(() => {
    const currentTime = moment.tz(timeZone);
    if (currentTime >= startTime && currentTime <= endTime) {
      // Call your desired function here
      console.log('Function called at', currentTime.format('YYYY-MM-DD HH:mm:ss z'));
    } else if (currentTime > endTime) {
      clearInterval(intervalId);
    }
  }, interval);
}





