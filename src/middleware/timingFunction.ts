
const timingFunction = (func:void, intervalInMin:number, startHour:number, endHour:number) =>{
    //making the hours argument date format
    const startTime = new Date();
  startTime.setHours(startHour, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, 0, 0);

//   changing interval to mili sec:
  const interval = intervalInMin * 60 * 1000; 

  const functionInterval = setInterval(()=>{
    const currentTime = new Date();
    if(startTime <= currentTime && currentTime <= endTime){
        func
    } else if(currentTime> endTime){
        clearInterval(functionInterval);
    }
  },interval)
}