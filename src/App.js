import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import AgentCard from './components/AgentCard';

function App() {
const [agents, setAgents] = useState([]);

useEffect(() => {
    const fetchAgents = async () => {
        // This is where the magic happens: calling your own API
        const response = await fetch('http://localhost:8000/agents');
        const data = await response.json(); 
        
        // Use the setter function to update the 'agents' variable
        setAgents(data);
    };

    fetchAgents();
}, []); // The empty array ensures this runs only once

  return (
    <div className="App">
      <h1>My Valorant Agents</h1>
      <div>
        {agents.map(agent => (
          <div key={agent.id}> 
            <h3>{agent.displayName}</h3>
            <p>Role: {agent.role}</p>
          </div>
        ))}
      </div>
    </div>
);
}

export default App;
