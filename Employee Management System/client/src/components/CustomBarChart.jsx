
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
const CustomBarChart = ({ data, xKey, yKey, color = "#22d3ee" }) => {
  const hasData = data && data.length > 0
  return (
    
    hasData ?
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data} 
        margin={{ bottom: 30, left: 10, right: 10, top: 10 }}
      >
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280" 
          tick={{ fill: "#9ca3af", fontSize: 12 }} 
          interval={0} 
          angle={-30} 
          textAnchor="end" 
          height={70} 
        />
        <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
          cursor={{ fill: "rgba(255,255,255,0.1)" }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer> : <p className="text-gray-400 text-sm italic">No data 🧊</p>
  );
};

export default CustomBarChart;



