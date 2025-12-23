import React from "react";

interface MatchRowProps {
  agentName: string;
  mapName: string;
  score: string;
  roundsWon: string;
  roundsLost: string;
  kda: string;
  kdRatio: string; // Added this!
  isWin: boolean;
  position: string;
  hsPercent: number;
  adr: number;
  acs: number;
}

// MAKE SURE ALL THESE ARE INSIDE THE { }
const MatchRow = ({
  agentName,
  mapName,
  roundsWon,
  roundsLost,
  score,
  kda,
  kdRatio,
  isWin,
  position,
  hsPercent,
  adr,
  acs,
}: MatchRowProps) => {
  const borderColor = isWin ? "border-[#16e5b4]" : "border-[#ff4655]";
  const getPositionStyles = (pos: string) => {
    if (pos === "MVP") return "bg-[#cbb765] text-[#000000]";
    if (pos === "2nd") return "bg-[#99B0CC] text-[#000000]";
    if (pos === "3rd") return "bg-[#A86243] text-[#000000]";
    return "bg-[#2C3F52] text-[#99ABBF]";
  };
  const positionStyles = getPositionStyles(position);

  return (
    <div
      className={`
      relative grid-cols-[2fr_1fr_3fr] grid gap-4 items-center h-20 w-full 
      bg-[#0F1923] border-l-[6px] ${borderColor} px-4 mb-2 
      hover:bg-[#1f2b35] transition-colors
    `}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-600 rounded-md shrink-0"></div>
        <div className="flex flex-col justify-center">
          <span className="text-white font-bold text-lg leading-tight">
            {mapName}
          </span>
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            {agentName}
          </span>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 font-bold text-2xl tracking-wider leading-none">
          <span className="w-8 text right text-[#16e5b4]">{roundsWon}</span>
          <span className="text-white">:</span>
          <span className="w-8 text-left text-[#ff4655] transform translate-y-[1.7px]">
            {roundsLost}
          </span>
        </div>

        <div className=" text-sm text-gray-500 font-bold mt-3">
          <span
            className={`w-12 h-5 flex items-center justify-center rounded-full ${positionStyles}`}
          >
            {position}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-end gap-8 pr-2">
        {/* STAT BLOCK 1: KDA */}
        <div className="flex flex-col items-end min-w-[40px]">
          <span className="text-gray-500 text-sm font-bold uppercase">
            K / D / A
          </span>
          <span className="text-lg text-white font-bold font-mono leading-tight">
            {kda}
          </span>
        </div>

        {/* STAT BLOCK 2: KD */}
        <div className="flex flex-col items-end min-w-[40px]">
          <span className="text-sm text-gray-500 font-bold uppercase">K/D</span>
          <span className="text-white font-bold text-lg leading-tight">
            {kdRatio}
          </span>
        </div>
        {/* STAT BLOCK 3: HS% */}
        <div className="flex flex-col items-end min-w-[40px]">
          <span className="text-sm text-gray-500 font-bold uppercase">HS%</span>
          <span className="text-white font-bold text-lg leading-tight">
            {hsPercent}%
          </span>
        </div>

        {/* STAT BLOCK 4: ADR */}
        <div className="flex flex-col items-end min-w-[40px]">
          <span className="text-gray-500 text-sm font-bold uppercase">ADR</span>
          <span className="text-white font-bold text-lg leading-tight">
            {adr}
          </span>
        </div>

        {/* STAT BLOCK 5: ACS */}
        <div className="flex flex-col items-end min-w-[40px]">
          <span className="text-gray-500 text-sm font-bold uppercase">ACS</span>
          <span className="text-white font-bold text-lg leading-tight">
            {acs}
          </span>
        </div>
      </div>
    </div>
  ); // Added missing closing parenthesis for the return
};

export default MatchRow;
