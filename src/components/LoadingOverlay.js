import React from 'react';

// Composant pour le spinner de chargement
const LoadingSpinner = ({ size = 40, color = '#9557fa' }) => {
  return (
    <div className="spinner-container">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 38 38" 
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18"/>
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"/>
            </path>
          </g>
        </g>
      </svg>
    </div>
  );
};

// Composant principal de chargement avec état d'avancement
const LoadingOverlay = ({ isLoading, loadingSteps = [], currentStep = 0 }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <LoadingSpinner />
        <h2>Préparation de votre voyage en cours...</h2>
        
        {loadingSteps.length > 0 && (
          <div className="loading-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {loadingSteps.map((step, index) => (
                <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
                  <div className="step-indicator">{index <= currentStep ? '✓' : index + 1}</div>
                  <div className="step-label">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          transition: opacity 0.3s;
        }
        
        .loading-content {
          text-align: center;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
          max-width: 80%;
          width: 500px;
        }
        
        .loading-content h2 {
          margin: 16px 0;
          color: #333;
          font-size: 24px;
        }
        
        .spinner-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .loading-progress {
          margin-top: 24px;
        }
        
        .progress-bar {
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, #9557fa, #fa9b3d);
          transition: width 0.5s ease;
        }
        
        .progress-steps {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 12px;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          text-align: center;
          min-width: 100px;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        
        .progress-step.completed {
          opacity: 1;
        }
        
        .step-indicator {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;
          font-weight: bold;
          color: #666;
          transition: all 0.3s;
        }
        
        .completed .step-indicator {
          background: linear-gradient(to right, #9557fa, #fa9b3d);
          color: white;
        }
        
        .step-label {
          font-size: 14px;
          color: #666;
          max-width: 120px;
        }
        
        .completed .step-label {
          color: #333;
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .loading-content {
            padding: 20px;
            width: 90%;
          }
          
          .progress-steps {
            flex-direction: column;
            align-items: center;
          }
          
          .progress-step {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;