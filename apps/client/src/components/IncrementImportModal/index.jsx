import axios from "axios";
import { useState } from "react";

import useRefreshToken from "../../common/refreshToken";

const IncrementItemForm = ({ onClose, itemId }) => {
  const [productProvider, setProductProvider] = useState("");
  const [number, setNumber] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productProviderError, setProductProviderError] = useState("");
  const [numberError, setNumberError] = useState("");
  const refreshAccessToken = useRefreshToken();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    let valid = true;

    if (!productProvider) {
      setProductProviderError("Məhsul təchizatçısı sahəsini doldurmalısınız");
      valid = false;
    } else {
      setProductProviderError("");
    }

    if (!number || number <= 0) {
      setNumberError("Bu sahəni doldurmalısınız və sayı müsbət olmalıdır");
      valid = false;
    } else {
      setNumberError("");
    }

    if (!valid) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const data = {
      item_id: itemId,
      product_provider: productProvider,
      number: number
    };

    try {
      const response = await axios.post("http://37.61.77.5/services/increment_import/", data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuccess(response.data.message);
        onClose();
      }
    } catch (error) {
      if (error.status == 403) {
        await refreshAccessToken();
        handleSubmit();
      }
    }
  };

  return (
    <div className="export-modal">
      <div className="export-modal-content">
        <div className="export-modal-title">
          <h5>İdxal</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="export-form">
            <label>
              Məhsul Təchizatçısı
              <input type="text" value={productProvider} onChange={e => setProductProvider(e.target.value)} />
              {productProviderError && <p className="error-message">{productProviderError}</p>}
            </label>
            <label>
              Sayı
              <input
                type="number"
                value={number}
                onKeyDown={evt => (evt.key === "e" || evt.key === "-") && evt.preventDefault()}
                onChange={e => setNumber(e.target.value)}
              />
              {numberError && <p className="error-message">{numberError}</p>}
            </label>
          </div>
          <button type="submit" className="submit-btn">
            İdxal et
          </button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default IncrementItemForm;
