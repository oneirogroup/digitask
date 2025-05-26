import { useState } from "react";
import { AiFillMail } from "react-icons/ai";
import { FaQuestionCircle } from "react-icons/fa";
import { FaChevronRight, FaCircleExclamation } from "react-icons/fa6";
import { RiMessage2Fill } from "react-icons/ri";

import Switch from "@mui/material/Switch";

import "./settings.css";

function Settings() {
  const [checkedEmail, setCheckedEmail] = useState(true);

  const handleChangeEmail = event => {
    setCheckedEmail(event.target.checked);
  };

  const [checkedMessage, setCheckedMessage] = useState(true);

  const handleChangeMessage = event => {
    setCheckedMessage(event.target.checked);
  };

  return (
    <div className="setting-page">
      <div>
        <h1>Parametrlər</h1>
        <div className="settings-fields">
          <div>
            <div>
              <AiFillMail />

              <p>E-mail bildirişləri</p>
            </div>
            <Switch checked={checkedEmail} onChange={handleChangeEmail} inputProps={{ "aria-label": "controlled" }} />
          </div>
          <div>
            <div>
              <RiMessage2Fill />
              <p>SMS bildirişləri</p>
            </div>
            <Switch
              checked={checkedMessage}
              onChange={handleChangeMessage}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>
          <button>
            <div>
              <FaQuestionCircle /> <p>Dəstək</p>
            </div>
            <FaChevronRight />
          </button>
          <button>
            <div>
              <FaCircleExclamation /> <p>Haqqında</p>
            </div>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
