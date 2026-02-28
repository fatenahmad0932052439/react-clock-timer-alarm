import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import './App.css';
import { Howl } from 'howler';
export default function Clock(){
    // Clock
    const [currentTime, setCurrentTime] = useState(moment()); 
    //   Timer
    const [time, setTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);
    // Alarm
    const [alarmTime, setAlarmTime] = useState('');
    const [alarmSet, setAlarmSet] = useState(false);
    const [alarmTriggered, setAlarmTriggered] = useState(false);
    const alarmIntervalRef = useRef(null);
    // Clock
    useEffect(()=>{
        const timer=setInterval(()=>{
        setCurrentTime(moment())},1000)
        return ()=>clearInterval(timer)
    },[]) 
    const playSound = () => {
      const sound = new Howl({
     src: ['/sounds/alarm.mp3'],
     volume: 0.5,
     loop: false,
     rate: 1.0,
     });
      
     sound.play();  
     setTimeout(()=>
     sound.stop(),3000)
    };
    // Timer
   useEffect(() => {
     if (isActive && !isPaused) {
     intervalRef.current = setInterval(() => {
      setTime((prev) => {
        let hours = parseInt(prev.hours);
        let minutes = parseInt(prev.minutes);
        let seconds = parseInt(prev.seconds);
        
        if (hours === 0 && minutes === 0 && seconds === 0) {
          setIsActive(false);
          playSound();
          return prev;
        }

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        };
        });
       },1000);
      }
      return () => clearInterval(intervalRef.current)
     },[isActive,isPaused])
    //  Start
     const handleStart = () => {
      const hours = parseInt(time.hours) || 0;
     const minutes = parseInt(time.minutes) || 0;
     const seconds = parseInt(time.seconds) || 0;
    
     if (hours === 0 && minutes === 0 && seconds === 0) {
     alert('Please enter a valid time');
       return;
     }
    
     setTime({
       hours: hours.toString().padStart(2, '0'),
     minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
     });
    
     setIsActive(true);
     setIsPaused(false);
     };
      const handlePause = () => {
     setIsPaused(true);
     setIsActive(false);
     };
      const handleReset = () => {
     setIsActive(false);
     setIsPaused(false);
     setTime({
       hours: '00',
       minutes: '00',
      seconds: '00'
     });
     };
     // Resume
     const handleResume = () => {
     setIsPaused(false);
     setIsActive(true);
     };
     const handleTimeInput = (e, unit) => {
       let value = e.target.value;
    

     if (!/^\d*$/.test(value)) return;
    

     if (unit === 'hours') {
      if (parseInt(value) > 99) value = '99';
     }
      else if(unit ==='minutes'){
       if (parseInt(value) > 59) value = '59';
     }
     else
      {if (parseInt(value) > 59) value = '59';}
     
    
    setTime({
       ...time,
       [unit]: value
   });}

    // SetAlarm
    const handleSetAlarm = () => {
  if (!alarmTime) {
    alert("Please select an alarm time");
    return;
  }
  setAlarmSet(true);
  setAlarmTriggered(false);
  alert(`✅ Alarm set for ${alarmTime}`);
};

const handleClearAlarm = () => {
  setAlarmSet(false);
  setAlarmTriggered(false);
  setAlarmTime('');
};

useEffect(() => {
  
  if (!alarmSet || alarmTriggered) return;

  alarmIntervalRef.current = setInterval(() => {
    const now = moment();
    const currentTimeString = now.format('HH:mm');
    
    if (currentTimeString === alarmTime && !alarmTriggered) {
      playSound();
      
      setAlarmTriggered(true);
      setAlarmSet(false);
      
      if (Notification.permission === 'granted') {
        new Notification('🔔 Alarm', {
          body: `Time's up! ${alarmTime}`
        });
      }
    }
  }, 1000);

  return () => clearInterval(alarmIntervalRef.current);
}, [alarmTime, alarmSet, alarmTriggered]);

  



     return(
     <>
     <div className="clock">
         <h1>🕐 Digital Clock</h1>
         <p className="clock-display">{currentTime.format('HH:mm:ss')}</p>
         <p className="clock-date">{currentTime.format('dddd, MMMM Do YYYY')}</p>
     </div>
      <div className="timer">
         <h1>⏳ Countdown Timer</h1>
          <div className="timer-inputs">
          <input 
             type="text"
             value={time.hours} 
             onChange={(e) => handleTimeInput(e, 'hours')}
             placeholder="HH"
             maxLength="2"
             disabled={isActive}
          />
         <span>:</span>
          <input 
             type="text"
             value={time.minutes} 
             onChange={(e) => handleTimeInput(e, 'minutes')}
             placeholder="MM"
             maxLength="2"
             disabled={isActive}
          />
           <span>:</span>
           <input 
             type="text"
             value={time.seconds} 
             onChange={(e) => handleTimeInput(e, 'seconds')}
             placeholder="SS"
             maxLength="2"
            disabled={isActive}
           />
        </div>
        <div className="timer-display">
          {time.hours}:{time.minutes}:{time.seconds}
         </div>
         <div className="timer-controls">
         {!isActive && !isPaused ? (
            <button onClick={handleStart} className="start-btn">Start</button>
         ) : null}
          
         {isActive && !isPaused ? (
            <button onClick={handlePause} className="pause-btn">Pause</button>
         ) : null}
          
          {!isActive && isPaused ? (
            <button onClick={handleResume} className="resume-btn">Resume</button>
         ) : null}
         <button onClick={handleReset} className="reset-btn">Reset</button>
         </div> 
         </div>
          <div className="alarm-section">
         <h1>🔔 Alarm System</h1>
        
         <div className="alarm-input">
           <input
             type="time"
             value={alarmTime}
             onChange={(e) => setAlarmTime(e.target.value)}
             className="time-input"
           />
           {!alarmSet ? (
            <button onClick={handleSetAlarm} className="set-alarm-btn">
              Set Alarm
             </button>
             ) : (
             <button onClick={handleClearAlarm} className="clear-alarm-btn">
              Clear Alarm
            </button>
          )}
         </div>

         {alarmSet && (
           <div className="alarm-status">
             ⏰ Alarm set for: {alarmTime}
           </div>
        )}

        {alarmTriggered && (
           <div className="alarm-triggered">
             🔔 Alarm ringing!
          </div>
         )}
   
        </div>



    </>
    )





}
 