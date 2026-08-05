import React from 'react';

export const RiskBadge = ({ level }) => {
  const normalized = (level || 'LOW').toUpperCase();
  let badgeClass = 'badge-low';

  if (normalized === 'MEDIUM') badgeClass = 'badge-medium';
  if (normalized === 'HIGH') badgeClass = 'badge-high';
  if (normalized === 'CRITICAL') badgeClass = 'badge-critical';
  if (normalized === 'RESOLVED' || normalized === 'SUCCESS') badgeClass = 'badge-success';

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      {normalized}
    </span>
  );
};
