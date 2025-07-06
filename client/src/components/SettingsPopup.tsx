import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SettingsPopup = ({ onClose }) => {
  const [token, setToken] = useState<any>("");

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token)
  }, [])

  const setTokenFunction = () => {
    localStorage.setItem('token',token)
    onClose({refresh:true})
  }

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup">
        <div className="settings-header">
          <h2>Settings</h2>
          <X className="close-icon" onClick={onClose} />
        </div>

        <form >
          <label htmlFor="token-input" className="settings-label">
            Token
          </label>
          <input
            type="text"
            id="token-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="settings-input"
            placeholder="Enter your token"
          />
          <button type="submit" onClick={setTokenFunction} className="settings-submit">
            SET
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPopup;
