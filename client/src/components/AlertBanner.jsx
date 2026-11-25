function AlertBanner({ alert }) {
  if (!alert) return null;

  return (
    <div className="container">
      <div className={`alert alert-${alert.type}`} role="status">
        {alert.message}
      </div>
    </div>
  );
}

export default AlertBanner;
