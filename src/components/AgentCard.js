import React from 'react';

// The function receives a single argument: 'props'
function AgentCard(props) {
    // We will use 'props' inside this return block:
    return (
        <div className="agent-card">
            <h2>{props.agent.displayName}</h2> 
            <p>Role: {props.agent.role}</p>
            {/* We'll add styling later */}
        </div>
    );
}

export default AgentCard; // This is necessary to let other files import it