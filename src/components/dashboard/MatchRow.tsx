import React from "react";

interface MatchRowProps {
  agent_name: string;
  map: string;
  roundsWon: number;
  roundsLost: number;
  kda: string;
  kdRatio: number; // Added this!
  result: string;
  fmt_pos: string;
  hsPercent: number;
  adr: number;
  acs: number;
  agent_image: string;
}

// MAKE SURE ALL THESE ARE INSIDE THE { }
const MatchRow = ({
  agent_name,
  map,
  roundsWon,
  roundsLost,
  kda,
  kdRatio,
  result,
  fmt_pos,
  hsPercent,
  adr,
  acs,
  agent_image
}: MatchRowProps) => {
  const getBorderColor = (res: string) => {
    if (res === "win") return "border-[#5EE790]";
    if (res === "lose") return "border-[#E4485D]";
    if (res === "draw") return "border-[#CBB765]";
    return "border-gray-500";
  }
  const borderColor = getBorderColor(result);
  const getPositionStyles = (pos: string) => {
    if (pos === "MVP") return "bg-[#cbb765] text-[#000000]";
    if (pos === "2nd") return "bg-[#99B0CC] text-[#000000]";
    if (pos === "3rd") return "bg-[#A86243] text-[#000000]";
    return "bg-[#2C3F52] text-[#99ABBF]";
  };
  const positionStyles = getPositionStyles(fmt_pos);

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
        <div className="w-12 h-12 rounded-md shrink-0">
          <img src ={agent_image} alt={agent_name} className="w-full h-full object-cover rounded-md" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-white font-bold text-lg leading-tight">
            {map}
          </span>
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            {agent_name}
          </span>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 font-bold text-2xl tracking-wider leading-none">
          <span className="text-[#16e5b4]">{roundsWon}</span>
          <span className="text-white">:</span>
          <span className="text-[#ff4655] transform translate-y-[1.7px]">
            {roundsLost}
          </span>
        </div>

        <div className=" text-sm text-gray-500 font-bold mt-3">
          <span
            className={`w-12 h-5 flex items-center justify-center rounded-full ${positionStyles}`}
          >
            {fmt_pos}
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
