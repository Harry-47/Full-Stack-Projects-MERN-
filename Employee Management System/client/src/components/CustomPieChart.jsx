import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CustomPieChart = ({ data, dataKey = "value" }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden"> 
      <div className="flex-1 min-h-[200px] flex items-center justify-center">
        {!hasData ? (
          <p className="text-gray-400 text-sm italic">No data 🧊</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius="60%" 
                outerRadius="80%"
                paddingAngle={5}
                dataKey={dataKey}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      
      {hasData && (
        <div className="flex justify-center gap-x-3 gap-y-2 text-[10px] mt-2 flex-wrap max-h-[100px] overflow-y-auto px-2 pb-4 mb-4 overflow-auto">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-gray-500 font-bold uppercase truncate max-w-[80px]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomPieChart;