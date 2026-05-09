import React from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiDownload } from 'react-icons/fi';
import './ResumeModal.css';

const ResumeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Handle click on backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('resume-modal-overlay')) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="resume-modal-overlay" onClick={handleBackdropClick}>
      <div className="resume-modal-container">
        <div className="resume-modal-header">
          <h3 className="resume-modal-title">Gopal Muri - Resume</h3>
          <div className="resume-modal-actions">
            <a 
              href="/resume.pdf" 
              download="Gopal_Muri_Resume.pdf" 
              className="resume-modal-btn resume-modal-btn--download"
              title="Download PDF"
            >
              <FiDownload />
              <span>Download</span>
            </a>
            <button 
              className="resume-modal-btn resume-modal-btn--close" 
              onClick={onClose}
              title="Close"
            >
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="resume-modal-body">
          <iframe 
            src="/resume.pdf#toolbar=0" 
            title="Resume Viewer"
            className="resume-viewer"
          />
        </div>
        
        <div className="resume-modal-footer">
          <p>Displaying Gopal Muri's Professional Experience</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ResumeModal;
