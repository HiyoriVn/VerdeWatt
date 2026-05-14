import React from "react";
import { Clock, Battery, Zap, BatteryCharging } from "lucide-react";

function VehicleDetailPanel({ selectedEvId, sessions }) {
  if (!selectedEvId) {
    return (
      <div className="vehicle-lookup empty-state">
        <p className="muted-text">Select an EV from the list to view its charging strategy.</p>
      </div>
    );
  }

  const session = sessions?.find((s) => s.id === selectedEvId);

  if (!session) {
    return (
      <div className="vehicle-lookup empty-state">
        <p className="muted-text">Vehicle data not found.</p>
      </div>
    );
  }

  const priorityKey = String(session.priority || "normal").toLowerCase();

  return (
    <div className="vehicle-lookup-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card">
        <div className="vehicle-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <span className="label" style={{ fontSize: '12px', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected Vehicle</span>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '24px' }}>{session.id}</h2>
          </div>
          <span className={`ev-priority-badge priority-${priorityKey}`}>{priorityKey}</span>
        </div>
        <div className="vehicle-recommendation-alert" style={{ display: 'flex', gap: '12px', background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', alignItems: 'center' }}>
          <div className="alert-icon" style={{ fontSize: '18px' }}>✨</div>
          <p className="vehicle-recommendation-text" style={{ fontSize: '13px', margin: 0, color: 'var(--text)', fontWeight: '500', lineHeight: 1.4 }}>
            Vehicle requires optimized charging strategy based on SOC and deadline.
          </p>
        </div>
      </div>

      <div className="vehicle-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-soft)', fontSize: '13px', fontWeight: '500' }}>
            <Clock size={16} style={{ color: '#3b82f6' }} />
            <span>Deadline</span>
          </div>
          <strong style={{ fontSize: '20px', fontWeight: '600' }}>{session.deadline_hour}:00</strong>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-soft)', fontSize: '13px', fontWeight: '500' }}>
            <Battery size={16} style={{ color: '#22c55e' }} />
            <span>Battery</span>
          </div>
          <strong style={{ fontSize: '20px', fontWeight: '600' }}>{session.battery_kwh}<small style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '2px' }}>kWh</small></strong>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-soft)', fontSize: '13px', fontWeight: '500' }}>
            <BatteryCharging size={16} style={{ color: '#f59e0b' }} />
            <span>SOC Progress</span>
          </div>
          <strong style={{ fontSize: '20px', fontWeight: '600' }}>{session.current_soc}% &rarr; {session.target_soc}%</strong>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-soft)', fontSize: '13px', fontWeight: '500' }}>
            <Zap size={16} style={{ color: '#a855f7' }} />
            <span>Max Charging</span>
          </div>
          <strong style={{ fontSize: '20px', fontWeight: '600' }}>{session.max_charging_kw}<small style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '2px' }}>kW</small></strong>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPanel;
