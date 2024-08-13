import "./mapModal.css";

function index({ onClose }) {
    return (
        <div className="map-modal-modal-overlay">
            <div className="map-modal-modal-content">
                <div className="map-modal-modal-header">
                    <h2>İstifadəçinin ünvanı</h2>
                    <span className="map-modal-close-button" onClick={onClose}>
                        &times;
                    </span>
                </div>
                <hr />
                <div className="map-modal-modal-body">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48612.26588875514!2d49.8597888!3d40.402944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d7118f3ebbb%3A0xd6db2a60af775bdf!2sKoala%20Park!5e0!3m2!1saz!2saz!4v1723576985429!5m2!1saz!2saz"
                        width="645"
                        height="400"
                        style={{ border: '0' }}
                        allowfullscreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}

export default index;
