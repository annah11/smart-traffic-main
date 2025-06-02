import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DeviceLogs: React.FC = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();

  const logs = [
    { time: "12:01", message: "Device started successfully." },
    { time: "12:03", message: "Sent data packet to server." },
    { time: "12:05", message: "Warning: signal strength low." },
    { time: "12:08", message: "Device entered power-saving mode." },
    { time: "12:12", message: "Data sync completed." },
    { time: "12:14", message: "Device restarted." },
    { time: "12:17", message: "Firmware update check initiated." },
    { time: "12:20", message: "Heartbeat sent to server." },
    { time: "12:25", message: "Signal normalized." },
    { time: "12:30", message: "Low battery warning issued." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1 tracking-tight">
            📋 Device Logs
          </h1>
          <p className="text-sm text-gray-400">
            Viewing logs for device:{" "}
            <span className="text-blue-400 font-medium">{deviceId}</span>
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-semibold transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <div className="h-[70vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className="p-5 bg-[#1f1f1f] border-l-4 border-blue-500 rounded-lg shadow-md animate-slideIn opacity-90 hover:opacity-100 transition-all duration-300"
          >
            <p className="text-xs text-gray-400 mb-1">[{log.time}]</p>
            <p className="text-base text-white">{log.message}</p>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #222;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeviceLogs;
