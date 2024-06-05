import "./export.css"

function index({ onClose }) {
    return (
        <div className="export-modal">
            <div className="export-modal-content">
                <div className='export-modal-title'>
                    <h5>Ixrac</h5>
                    <span className="close" onClick={onClose}>&times;</span>
                </div>
            </div>
        </div>
    )
}

export default index