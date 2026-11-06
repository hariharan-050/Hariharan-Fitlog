import React from 'react';
import { Dumbbell, Flame, Trophy, Activity } from 'lucide-react';

const StatCards = ({ stats = {} }) => {
  const cardData = [
    {
      id: 'workouts',
      label: 'TOTAL WORKOUTS',
      value: stats.totalWorkouts ?? 0,
      icon: Dumbbell,
      color: 'stat-blue',
    },
    {
      id: 'streak',
      label: 'ACTIVE STREAK',
      value: `${stats.activeStreak ?? 0} Days`,
      icon: Flame,
      color: 'stat-orange',
    },
    {
      id: 'prs',
      label: 'PERSONAL RECORDS',
      value: stats.personalRecords ?? 0,
      icon: Trophy,
      color: 'stat-amber',
    },
    {
      id: 'readiness',
      label: 'TRAINING READINESS',
      value: stats.readiness || 'Optimal',
      icon: Activity,
      color: 'stat-emerald',
    },
  ];

  return (
    <div className="stat-cards-grid">
      {cardData.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.id} className={`stat-card ${card.color}`}>
            <div className="stat-card-inner">
              <div className="stat-icon-wrapper">
                <Icon size={22} className="stat-icon" />
              </div>
              <div className="stat-details">
                <span className="stat-label">{card.label}</span>
                <span className="stat-value">{card.value}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
