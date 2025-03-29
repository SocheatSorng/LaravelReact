import React from "react";

function StatCard({ title, count, icon, percentage, trend }) {
  // Format count with commas for thousands
  const formatCount = (value) => {
    return new Intl.NumberFormat().format(value);
  };

  return (
    <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <h5 className="card-title text-muted fs-6 fw-normal mb-2">
                {title}
              </h5>
              <h3 className="fw-semibold mb-2">{formatCount(count)}</h3>
              {percentage && (
                <span
                  className={`badge ${
                    trend === "up"
                      ? "bg-success-subtle text-success"
                      : "bg-danger-subtle text-danger"
                  } fs-12`}
                >
                  <i
                    className={`bx ${
                      trend === "up" ? "bx-up-arrow-alt" : "bx-down-arrow-alt"
                    }`}
                  ></i>{" "}
                  {percentage}
                </span>
              )}
            </div>
            <div className="avatar">
              <div className="avatar-initial bg-light-subtle rounded p-2 fs-3">
                {icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
