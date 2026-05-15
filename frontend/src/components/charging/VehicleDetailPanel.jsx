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

      <div className="vehicle-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-soft)', fontSize: '15px', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
              <Clock size={22} />
            </div>
            <span>Deadline</span>
          </div>
          <strong style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text)', lineHeight: '1', letterSpacing: '-0.5px' }}>{session.deadline_hour}:00</strong>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-soft)', fontSize: '15px', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
              <Battery size={22} />
            </div>
            <span>Battery</span>
          </div>
          <strong style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text)', lineHeight: '1', letterSpacing: '-0.5px' }}>{session.battery_kwh}<small style={{ fontSize: '18px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '500' }}>kWh</small></strong>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-soft)', fontSize: '15px', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
              <BatteryCharging size={22} />
            </div>
            <span>SOC Progress</span>
          </div>
          <strong style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text)', lineHeight: '1', letterSpacing: '-0.5px' }}>{session.current_soc}% <span style={{color: 'var(--text-muted)', fontWeight: '400', fontSize: '26px', margin: '0 6px'}}>&rarr;</span> {session.target_soc}%</strong>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
          <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-soft)', fontSize: '15px', fontWeight: '600' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: '#a855f7' }}>
              <Zap size={22} />
            </div>
            <span>Max Charging</span>
          </div>
          <strong style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text)', lineHeight: '1', letterSpacing: '-0.5px' }}>{session.max_charging_kw}<small style={{ fontSize: '18px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '500' }}>kW</small></strong>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPanel;
