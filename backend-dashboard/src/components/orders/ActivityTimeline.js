import React from 'react';

function ActivityTimeline() {
  return (
    <div>
      <div className="offcanvas offcanvas-end border-0" tabIndex="-1" id="theme-activity-offcanvas" style={{maxWidth: "450px", width: "100%"}}>
        <div className="d-flex align-items-center bg-primary p-3 offcanvas-header">
          <h5 className="text-white m-0 fw-semibold">Activity Stream</h5>
          <button type="button" className="btn-close btn-close-white ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <div className="h-100 p-4">
            <div className="position-relative ms-2">
              {/* Add activity items here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityTimeline;