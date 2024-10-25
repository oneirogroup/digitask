import axios from 'axios';
import { useState, useEffect } from 'react';
import "./export.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const DecrementItemForm = ({ onClose, itemId, productNumber,action,fetchData }) => {

  const [deliveryNote, setDeliveryNote] = useState("");
  const [newCount, setNewCount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [numberError, setNumberError] = useState("");



  useEffect(() => {
    const inputElement = document.getElementById('number-input');
    const handleWheel = (e) => {
      e.preventDefault();
    };

    if (inputElement) {
      inputElement.addEventListener('wheel', handleWheel);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleNoteChange = (e) => {
    setDeliveryNote(e.target.value)
  }

  const handleNumberChange = (e) => {
    let value = e.target.value;


    if (value < 0) {
      setNumberError('0-dan kicik eded daxil edile bilmez')
      return;
    }

    if (action.action === "decrement" && value > productNumber) {
      setNumberError(`${productNumber} məhsul sayını keçmək olmaz`)
      value = productNumber;
    }

    if (action.action === "increment" && value > 1000) {
      setNumberError(`Birdəfəyə əlavə oluna bilən məhsul sayı 1000-i keçə bilməz`)
      value = 1000;
    }

    setNewCount(value);

  };

  useEffect(() => {
    console.log('newCount changed:', newCount);
  }, [newCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    let valid = true;

    if (!newCount) {
      setNumberError("Bu sahəni doldurmalısınız");
      valid = false;
    } else {
      setNumberError("");
    }

    if (!valid) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("No token found");
      return;
    }

    const data = {
      delivery_note: deliveryNote,
      old_count: parseInt(action.count),
      new_count: action.action == 'decrement'?parseInt(action.count) - parseInt(newCount) :parseInt(action.count) + parseInt(newCount),
      count: action.action == 'decrement'?parseInt(action.count) - parseInt(newCount) :parseInt(action.count) + parseInt(newCount)
    };
    console.log(data)
    try {
      const response = await axios.patch(`http://135.181.42.192/warehouse/warehouse-items/${itemId}/`, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.data.error) {
        console.log(response.data.error)
        setError(response.data.error);
      } else {
        setSuccess(response.data.message);
        fetchData();
        onClose();
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        try {
          await handleSubmit(e);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      } else {
        console.error('An error occurred:', error);
        setError("An error occurred");
      }
    }
  };



  return (
    <div className="export-modal">
      <div className="export-modal-content">
        <div className="export-modal-title">
          <h5>{action.actionName}</h5>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="export-form">


            <label>
              Say
              <input
                id="number-input"
                type="number"
                value={newCount}
                onChange={handleNumberChange}
                max={action.action=='decrement'?productNumber:10000}
              />
              {numberError && <p className="error-message">{numberError}</p>}
            </label>

            <label>
              Qeyd
              <input
                id="note-input"
                type="text"
                value={deliveryNote}
                onChange={handleNoteChange}
              />

            </label>


          </div>
          <button type="submit" className="submit-btn">{action.actionName}</button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default DecrementItemForm;