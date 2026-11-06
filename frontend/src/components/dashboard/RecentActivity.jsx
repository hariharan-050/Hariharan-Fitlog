import React from 'react';
import { Activity, Award, Dumbbell, Calendar, HeartPulse } from 'lucide-react';

const RecentActivity = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'WORKOUT',
      title: 'Completed Hypertrophy Session',
      subtitle: 'Upper Body Surge • 4 exercises',
      timestamp: 'Today, 09:30 AM',
    },
    {
      id: 2,
      type: 'AWARD',
      title: 'New Personal Record Achieved',
      subtitle: 'Bench Press: 100 kg target reached',
      timestamp: 'Yesterday',
    },
    {
      id: 3,
      type: 'METRIC',
      title: 'Biometric Telemetry Recorded',
      subtitle: 'Body Mass: 82.5 kg logged',
      timestamp: '2 days ago',
    },
  ];

  const items = activities && activities.length > 0 ? activities : defaultActivities;

  const getIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'AWARD':
        return <Award size={18} className="activity-icon icon-award" />;
      case 'METRIC':
        return <HeartPulse size={18} className="activity-icon icon-metric" />;
      case 'WORKOUT':
        return <Dumbbell size={18} className="activity-icon icon-workout" />;
      default:
        return <Activity size={18} className="activity-icon icon-activity" />;
    }
  };

  return (
    <div className="recent-activity-card page-card">
      <div className="activity-header">
        <div className="activity-title-group">
          <Activity size={20} className="activity-title-icon text-accent" />
          <h3 className="activity-title">Recent Activity Feed</h3>
        </div>
      </div>
      <div className="activity-stream">
        {items.map((item) => (
          <div key={item.id} className="activity-item">
            <div className="activity-icon-container">{getIcon(item.type)}</div>
            <div className="activity-details">
              <span className="activity-item-title">{item.title}</span>
              {item.subtitle && (
                <span className="activity-item-subtitle">{item.subtitle}</span>
              )}
            </div>
            {item.timestamp && (
              <span className="activity-timestamp">
                <Calendar size={12} className="inline-icon" />
                {item.timestamp}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
