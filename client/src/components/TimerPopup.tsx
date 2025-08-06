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
  Play,
  StepBack
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
  const [selectedProject, setselectedProject] = useState('')
  const [projectNavigation, setprojectNavigation] = useState(false)
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
    body = { ...body, ['id']: selectedTask._id, user: localStorage.getItem('token') }
    setrenderTask(selectedTask._id)

    axios.patch('https://www.cableergo.com/projects/timer/task/edit', body, { params: { project: selectedTask.projectId } }).then(async () => {
      await fetchTasks()
    }).catch((err) => {
      console.log(err.message)
    })
  }

  const fetchTasks = async () => {
    const { data } = await axios.get('https://www.cableergo.com/projects/timer/tasks', {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    })
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
    if (!localStorage.getItem('token')) setSettingsOpen(true)
    else fetchTasks()
  }, [])

  const closeSettingsPopup = (obj) => {
    setSettingsOpen(false)
    if (obj.refresh === true) fetchTasks()
  }

  const handleMinimize = () => {
    (window as any).electronAPI.minimizeApp();
  };

  function getTasksByProjectName(projectName) {
    return taskData.filter((task: any) => task.projectName === projectName);
  }

  function getTaskCountByProject() {
    const projectTaskMap = {};

    taskData.forEach((task: any) => {
      const projectName = task.projectName;
      if (projectTaskMap[projectName]) {
        projectTaskMap[projectName]++;
      } else {
        projectTaskMap[projectName] = 1;
      }
    });

    return Object.entries(projectTaskMap).map(([projectName, count]) => ({
      projectName,
      taskCount: count
    }));
  }

  const handleSelectionSelect = (task) => {
    if (!onWork) {
      if (projectNavigation) {
        setselectedTask(task)
      } else {
        setselectedProject(task.projectName)
        setprojectNavigation(true)
      }
    }
  }

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
                {!onWork && <span className="text">{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>}
                {!onWork && <RefreshCw className="icon" onClick={fetchTasks} />} 
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
                  {selectedTask.status === 'In Progress' ? <LiveHourTimer pauseTask={pauseWorkingFunction} initialHours={selectedTask.completedHours} maxHours={selectedTask.allocatedHours} /> : <div className="current-time">
                    {convertDecimalHoursToText(selectedTask.completedHours)}
                  </div>}
                  <div className="total-time">{selectedTask.status === 'In Progress' && 'Left'} Of {selectedTask.allocatedHours} Hrs</div>

                  {selectedTask.status === 'Paused' && <Play key={selectedTask} onClick={resumeWorkingFunction} className="pause" />}
                  {selectedTask.status === 'In Progress' && <Pause onClick={pauseWorkingFunction} className="pause" />}

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
                {projectNavigation && <p className="tasks-title" style={{ color: !onWork ? '#bf191970' : 'grey' ,textDecoration: 'underline', cursor: onWork ? 'not-allowed' : 'pointer' }} onClick={() => {
                  if(!onWork){
                    setprojectNavigation(false)
                    setselectedProject('')
                  }
                }}>All Projects</p>}
                <p className="tasks-title">{projectNavigation ? `${selectedProject} Tasks` : 'My Projects'}</p>
                <ul className="task-list">
                  {projectNavigation && getTasksByProjectName(selectedProject).map((task: any, index) => (
                    <li key={index} onClick={() => handleSelectionSelect(task)} className="task-item">
                      {index + 1} . {task.name}
                    </li>
                  ))}
                  {!projectNavigation && getTaskCountByProject().map((task: any, index) => (
                    <li key={index} onClick={() => handleSelectionSelect(task)} className="task-item">
                      {task.projectName} ({task.taskCount})
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
