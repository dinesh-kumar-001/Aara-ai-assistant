import React from 'react';

export function StatusBadge({ status, selectedVoice }) {
  const dbConnected = status?.database?.connected;
  const isZeroCost = status?.ai?.isZeroCostMode !== false;
  const provider = status?.ai?.configuredProvider || 'local';

  return (
    <div className="d-none d-md-flex align-items-center gap-2">
      {/* Zero Cost / AI Engine Badge */}
      <span
        className={`badge d-flex align-items-center gap-1 py-1 px-2 ${
          isZeroCost
            ? 'bg-success-subtle text-success border border-success-subtle'
            : 'bg-primary-subtle text-primary border border-primary-subtle'
        }`}
        title={status?.ai?.note || 'AI Engine Status'}
      >
        <i className={isZeroCost ? 'bi bi-lightning-charge-fill' : 'bi bi-cloud-check-fill'}></i>
        <span>{isZeroCost ? 'Zero-Cost Local Mode' : `AI: ${provider}`}</span>
      </span>

      {/* Database Badge */}
      <span
        className={`badge d-flex align-items-center gap-1 py-1 px-2 ${
          dbConnected
            ? 'bg-info-subtle text-info border border-info-subtle'
            : 'bg-secondary-subtle text-secondary border border-secondary-subtle'
        }`}
        title={dbConnected ? 'MongoDB Connected' : 'Running with zero-cost local JSON persistence'}
      >
        <i className={`bi ${dbConnected ? 'bi-database-check' : 'bi-hdd-fill'}`}></i>
        <span>{dbConnected ? 'MongoDB' : 'Local Storage'}</span>
      </span>

      {/* Voice Badge */}
      {selectedVoice && (
        <span
          className="badge bg-dark-subtle text-light border border-secondary-subtle d-none d-lg-flex align-items-center gap-1 py-1 px-2"
          title={`Active Voice: ${selectedVoice.name} (${selectedVoice.lang})`}
        >
          <i className="bi bi-mic-fill text-pink"></i>
          <span>{selectedVoice.name.slice(0, 14)}...</span>
        </span>
      )}
    </div>
  );
}

export default StatusBadge;
