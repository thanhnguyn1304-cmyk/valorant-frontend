// src/App.tsx
import StatCard from './components/dashboard/StatCard'; // <--- The bridge

function App() {
  return (
    <div className="flex gap-4 p-10 bg-slate-900 h-screen">
      <StatCard 
        title="Headshot %" 
        value="34.7%" 
        isGood={true} 
      />
      <StatCard 
        title="Win %" 
        value="38.5%" 
        isGood={false} 
        subtext="Bottom 11%"
      />
    </div>
  );
}

export default App;

