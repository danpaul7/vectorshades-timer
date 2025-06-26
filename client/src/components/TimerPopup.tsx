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
} from "lucide-react";
import SettingsPopup from "./SettingsPopup";

const TimerPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const tasks = [
    "Review blueprints and specifications carefully.",
    "Prepare comprehensive material list for procurement.",
    "Conduct quality checks on completed work sections.",
  ];

  return (
    <div className="app-wrapper">
      <button onClick={() => setIsOpen(true)} className="open-btn">
        <span className="btn-text">Open Timer UI</span>
      </button>

      { settingsOpen && (<SettingsPopup onClose={() => setSettingsOpen(false)} />)}

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <div className="onwork-label">
                <Laptop />
                <span className="text">ON WORK</span>
              </div>

              <div className="icon-group">
                <RefreshCw className="icon" />
                <Settings onClick={()=> setSettingsOpen(true)} className="icon" />
                <Minimize2 className="icon" onClick={() => setIsOpen(false)} />
              </div>
            </div>

            <div className="red-separator"></div>

            <div className="title-row">
              <div className="title">OFA FAB MODELLING</div>
              <div className="category">SouthWest Steel</div>
            </div>

            <div className="timer-container">
              <div className="timer-card">
                <div className="time-elaps">
                  <Clock />
                </div>
                <div className="current-time">
                  <b>2</b> Hours <b>09</b> Minutes <b>29</b> Seconds
                </div>
                <div className="total-time">Of 9 Hrs</div>

                <Pause className="pause" />

                <div className="progress-container">
                  <div className="progress-bar"></div>
                </div>
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
                  <div className="value">6th February</div>
                </div>

                <div className="info-card">
                  <div className="icon-label">Assigned By</div>
                  <div className="user-icon">
                    <img
                      src="https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250"
                      alt=""
                    />
                    <div>Abhishek M</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tasks-container">
              <div className="tasks-box">
                <p className="tasks-title">All Tasks</p>
                <ul className="task-list">
                  {tasks.map((task, index) => (
                    <li key={index} className="task-item">
                      {task}
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
