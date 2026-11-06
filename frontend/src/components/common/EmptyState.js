import React from 'react';
import { Layers } from 'lucide-react';

const EmptyState = ({
  title = 'No records matched',
  description = 'There are currently no items matching your criteria in the system repository.',
  actionButton = null,
  icon: CustomIcon = null,
}) => {
  const IconComponent = CustomIcon || Layers;

  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon">
        <IconComponent size={44} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
