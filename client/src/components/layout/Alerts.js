// need useContext hook
import React, { useContext } from "react";
import AlertContext from "../../context/alert/alertContext";

const Alerts = () => {
  // Initialize  alertContext
  //managing state with alertContext - avalible everywhere
  const alertContext = useContext(AlertContext);

  return (
    // if the alerts array has any, map over it and display the alerts
    alertContext.alerts.length > 0 &&
    alertContext.alerts.map((alert) => (
      // for each alert output a div
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <i className="fas fa-info-circle" /> {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
// this needs to go into App.js
