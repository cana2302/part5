const Notification = ({ message, notification }) => {
  if (notification === null) {
    return null
  }

  if (notification != null && message === 'error') {
    return (
      <div className="error">
        {notification}
      </div>
    )
  }

  if (notification != null && message === 'success') { 
    return (
      <div className="success">
        {notification}
      </div>
    )
  }

}

export default Notification