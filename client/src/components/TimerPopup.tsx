import { useState, useEffect } from "react";
import {
  X,
  RefreshCw,
  Settings,
  Minimize2,
  Clock,
  Laptop,
  Calendar,
  Pause,
  Play
} from "lucide-react";
import SettingsPopup from "./SettingsPopup";
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns';
import LiveHourTimer from "./Timer";

const TimerPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [taskData, setTaskData] = useState([])
  const [onWork, setonWork] = useState(false)
  const [selectedTask, setselectedTask] = useState<any>()
  const [renderTask, setrenderTask] = useState()
  const [lastUpdated, setlastUpdated] = useState<any>(new Date())
  const [settingsOpen, setSettingsOpen] = useState(false);

  function convertDecimalHoursToText(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);

    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${hours} Hour${hours !== 1 ? 's' : ''} ${paddedMinutes} Minute${minutes !== 1 ? 's' : ''}`;
  }

  const pauseWorkingFunction = () => editTaskHandler({ status: 'Paused' })

  const resumeWorkingFunction = () => editTaskHandler({ status: 'In Progress', startedOn: new Date() })

  const editTaskHandler = (body) => {
    body = { ...body, ['id']: selectedTask._id }
    setrenderTask(selectedTask._id)
    axios.patch('https://www.cableergo.com/projects/timer/task/edit', body, { params: { project: selectedTask.projectId } }).then(() => {
      fetchTasks()
    }).catch((err) => {
      console.log(err.message)
    })
  }

  const fetchTasks = async () => {
    const { data } = await axios.get('http://localhost:50000/projects/timer/tasks',{headers:{
      'Authorization':localStorage.getItem('token')
    }})
    const tasks = data.response.data
    setTaskData(tasks)
    const progressTasks = tasks.filter((e) => e.status === 'In Progress')
    if (renderTask) setselectedTask(tasks.filter((e) => e._id === renderTask)[0])
    if (progressTasks.length > 0) {
      setonWork(true)
      if (!renderTask) setselectedTask(progressTasks[0])
    }
    else setonWork(false)
    const date = new Date()
    setlastUpdated(date)
    return data
  }

  useEffect(() => {
    if(!localStorage.getItem('token')) setSettingsOpen(true)
    else fetchTasks()
  }, [])

  const closeSettingsPopup = (obj) => {
    setSettingsOpen(false)
    if(obj.refresh === true) fetchTasks()
  }

  const handleMinimize = () => {
    (window as any).electronAPI.minimizeApp();
};


  return (
    <div className="app-wrapper">
      <button onClick={() => setIsOpen(true)} className="open-btn">
        <span className="btn-text">Open Timer UI</span>
      </button>

      {settingsOpen && (<SettingsPopup onClose={closeSettingsPopup} />)}

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <div className="onwork-label" style={{ backgroundColor: onWork ? '#dd3c27' : '#80808085' }}>
                <Laptop />
                <span className="text">{onWork ? 'ON WORK' : 'ON IDLE'}</span>
              </div>

              <div className="icon-group">
                <span className="text">{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
                <RefreshCw className="icon" onClick={fetchTasks} />
                <Settings onClick={() => setSettingsOpen(true)} className="icon" />
                <Minimize2 className="icon" onClick={handleMinimize} />
              </div>
            </div>

            <div className="red-separator"></div>

            {selectedTask && <>
              <div className="title-row">
                <div className="title">{selectedTask.name}</div>
                <div className="category">{selectedTask.projectName}</div>
              </div>

              <div className="timer-container">
                <div className="timer-card">
                  <div className="time-elaps">
                    <Clock />
                  </div>
                  {selectedTask.status === 'In Progress' ? <LiveHourTimer initialHours={selectedTask.completedHours} /> : <div className="current-time">
                    {convertDecimalHoursToText(selectedTask.completedHours)}
                  </div>}
                  <div className="total-time">Of {selectedTask.allocatedHours} Hrs</div>

                  {selectedTask.status === 'Paused' && <Play key={selectedTask} onClick={resumeWorkingFunction} className="pause" />}
                  {selectedTask.status === 'In Progress' && <Pause key={selectedTask} onClick={pauseWorkingFunction} className="pause" />}

                </div>
              </div>

              <div className="card-wrapper-container">
                <div className="card-wrapper">
                  <div className="info-card">
                    <div className="icon-label">
                      <div className="icon-box calendar-icon">
                        <Calendar />
                      </div>
                      <div>Due Date</div>
                    </div>
                    <div className="value">{new Date(selectedTask.dueDate).toDateString()}</div>
                  </div>

                  <div className="info-card">
                    <div className="icon-label">Assigned By</div>
                    <div className="user-icon">
                      <div>{selectedTask.assignedByName}</div>
                    </div>
                  </div>
                </div>
              </div>

            </>}
            <div className="tasks-container">
              <div className="tasks-box">
                <p className="tasks-title">All Tasks</p>
                <ul className="task-list">
                  {taskData.map((task: any, index) => (
                    <li key={index} onClick={() => setselectedTask(task)} className="task-item">
                      {task.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerPopup;
