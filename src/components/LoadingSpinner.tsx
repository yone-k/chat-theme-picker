const LoadingSpinner = () => {
  const spinnerContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const relativeContainerStyles = {
    position: 'relative' as const,
    width: '3rem',
    height: '3rem'
  };

  const circleBaseStyles = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '9999px',
    border: '4px solid'
  };

  const backgroundCircleStyles = {
    ...circleBaseStyles,
    borderColor: '#fed7aa'
  };

  const spinningCircleStyles = {
    ...circleBaseStyles,
    borderColor: '#f97316',
    borderTopColor: 'transparent',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={spinnerContainerStyles}>
      <div style={relativeContainerStyles}>
        <div style={backgroundCircleStyles}></div>
        <div style={spinningCircleStyles}></div>
      </div>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner; 