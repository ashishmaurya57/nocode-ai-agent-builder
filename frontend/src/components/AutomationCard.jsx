import React from 'react';
import { Card } from 'react-bootstrap';

const AutomationCard = ({ automation }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{automation.name}</Card.Title>
        <Card.Text>
          <strong>Trigger:</strong> {automation.trigger?.type}<br />
          {automation.trigger?.type === 'cron' && (
            <>
              <strong>Schedule:</strong> {automation.trigger?.schedule}<br />
              <strong>Timezone:</strong> {automation.trigger?.timezone}
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AutomationCard;
