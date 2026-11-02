import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Thermometer, 
  Wind, 
  Flame, 
  Radio, 
  Lock, 
  Unlock, 
  Volume2, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Layers
} from 'lucide-react';
import { pushIoTTelemetry } from '../services/api';

export default function IoTSimulator({ classrooms, onUpdateRoomTelemetry }) {
  const [selectedRoomId, setSelectedRoomId] = useState('AB-204');
  const targetRoom = classrooms.find((c) => c.id === selectedRoomId) || classrooms[0];

  // Local simulator controls
  const [pirMotion, setPirMotion] = useState(targetRoom.pirDetected ?? true);
  const [ultrasonicDist, setUltrasonicDist] = useState(targetRoom.ultrasonicDistance ?? 135);
  const [tempVal, setTempVal] = useState(targetRoom.temperature ?? 24.2);
  const [humidityVal, setHumidityVal] = useState(targetRoom.humidity ?? 48);
  const [gasHazard, setGasHazard] = useState(false);
  const [isClassScheduled, setIsClassScheduled] = useState(false);
  const [isNodeOnline, setIsNodeOnline] = useState(true);
  const [demoLock, setDemoLock] = useState(false); // false = locked, true = unlocked
  const [rfidLog, setRfidLog] = useState('No recent scan');
  const [lastPacketTime, setLastPacketTime] = useState(new Date().toLocaleTimeString());

  // Determine State according to Milestone 2 & Milestone 4 logic:
  // 1. If offline -> Status Unknown
  // 2. If scheduled class + occupants detected -> Class in Session – Unavailable
  // 3. If no scheduled class + occupants detected -> Occupied – Open Use
  // 4. If no scheduled class + no occupants -> Available
  const evaluateOccupancyState = () => {
    if (!isNodeOnline) return 'Status Unknown';
    const hasOccupancy = pirMotion || ultrasonicDist < 180;
    if (isClassScheduled) return 'Class in Session – Unavailable';
    if (hasOccupancy) return 'Occupied – Open Use';
    return 'Available';
  };

  const calculatedState = evaluateOccupancyState();

  // Transmit telemetry packet to update state via REST API
  const handlePushTelemetry = async () => {
    const newState = evaluateOccupancyState();
    const updatedTelemetry = {
      id: selectedRoomId,
      status: newState,
      temperature: isNodeOnline ? parseFloat(tempVal) : null,
      humidity: isNodeOnline ? parseInt(humidityVal) : null,
      gasLevel: isNodeOnline ? (gasHazard ? 245 : 38) : null,
      pirDetected: isNodeOnline ? pirMotion : false,
      ultrasonicDistance: isNodeOnline ? parseInt(ultrasonicDist) : null,
      demoLockState: demoLock ? 'Unlocked' : 'Locked',
      rfidLastScan: rfidLog
    };

    if (onUpdateRoomTelemetry) {
      onUpdateRoomTelemetry(updatedTelemetry);
    }

    // Send HTTP POST to FastAPI backend endpoint
    if (isNodeOnline) {
      await pushIoTTelemetry({
        deviceId: `ESP32-NODE-${selectedRoomId}`,
        roomId: selectedRoomId,
        temperature: parseFloat(tempVal),
        humidity: parseInt(humidityVal),
        pirMotion: pirMotion,
        distanceCm: parseInt(ultrasonicDist),
        gasPpm: gasHazard ? 245 : 38,
        isHazard: gasHazard
      });
    }

    setLastPacketTime(new Date().toLocaleTimeString());
  };

  const handleSimulateRfidTap = (authorized = true) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (authorized) {
      setRfidLog(`Shubhi Mathur [BTEC25O1060] (Authorized at ${timeStr})`);
      setDemoLock(true);
      setTimeout(() => setDemoLock(false), 4000); // Auto relock after 4 sec
    } else {
      setRfidLog(`UNKNOWN CARD UID: 8C-B1-7A-09 (REJECTED at ${timeStr})`);
    }
  };

  // Generated JSON payload
  const currentPayload = {
    deviceId: `ESP32-NODE-${selectedRoomId}`,
    firmwareVersion: '1.4.0-MITS',
    timestamp: new Date().toISOString(),
    sensors: {
      pirMotionDetected: isNodeOnline ? pirMotion : false,
      ultrasonicDistanceCm: isNodeOnline ? ultrasonicDist : null,
      dht22: {
        temperatureC: isNodeOnline ? tempVal : null,
        humidityPercent: isNodeOnline ? humidityVal : null
      },
      mq2GasPpm: isNodeOnline ? (gasHazard ? 245 : 38) : null,
      gasAlertTriggered: gasHazard
    },
    actuators: {
      relayLockState: demoLock ? 'UNLOCKED' : 'LOCKED',
      statusLed: gasHazard ? 'RED_ALERT' : calculatedState === 'Available' ? 'GREEN_NORMAL' : 'YELLOW_WARNING',
      buzzerActive: gasHazard
    },
    computedContext: {
      timetableClassScheduled: isClassScheduled,
      resultingState: calculatedState
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#FFD000]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive ESP32 Virtual IoT Node Lab
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Simulate and test PIR motion, Ultrasonic distance, DHT22 temp/humidity, MQ-2 gas, and RFID without physical hardware.
          </p>
        </div>

        {/* Room Selector */}
        <div className="flex items-center gap-2 bg-[#FEF9C3]/40 dark:bg-[#18181E] px-3.5 py-2 rounded-xl border border-[#FDE047]/50 dark:border-[#2C2C34]">
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300">Monitored Classroom:</span>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="text-xs font-bold text-[#713F12] dark:text-[#FFD000] bg-transparent outline-none cursor-pointer"
          >
            {classrooms.map((r) => (
              <option key={r.id} value={r.id} className="dark:bg-[#121217] dark:text-white">{r.id} ({r.name})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hardware Sensor Controls Panel */}
          <div className="bg-white dark:bg-[#121217] rounded-2xl border border-slate-200 dark:border-[#222228] shadow-sm p-6 space-y-6">
            <h4 className="text-xs font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFD000]" /> Sensor Input Controllers
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 1. PIR Motion Switch (GPIO 27) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    PIR Motion (GPIO 27)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">Digital In</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3">Detects infrared radiation from human movement.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPirMotion(true); handlePushTelemetry(); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pirMotion ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-[#121217] text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    Motion Detected
                  </button>
                  <button
                    onClick={() => { setPirMotion(false); handlePushTelemetry(); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !pirMotion ? 'bg-slate-700 dark:bg-zinc-700 text-white shadow-sm' : 'bg-slate-100 dark:bg-[#121217] text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    No Motion
                  </button>
                </div>
              </div>

              {/* 2. Ultrasonic HC-SR04 Proximity (GPIO 12/14) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-blue-600" />
                    Ultrasonic Echo (GPIO 14)
                  </span>
                  <span className="text-xs font-mono font-bold text-[#713F12] dark:text-[#FFD000]">{ultrasonicDist} cm</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-2">Distance to closest student desk/doorway.</p>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="5"
                  value={ultrasonicDist}
                  onChange={(e) => { setUltrasonicDist(e.target.value); handlePushTelemetry(); }}
                  className="w-full accent-[#FFD000] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1">
                  <span>20 cm (Occupied)</span>
                  <span>400 cm (Empty Room)</span>
                </div>
              </div>

              {/* 3. DHT22 Temperature Slider (GPIO 15) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-rose-500" />
                    Temperature (GPIO 15)
                  </span>
                  <span className="text-xs font-mono font-bold text-[#713F12] dark:text-[#FFD000]">{tempVal}°C</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="42"
                  step="0.5"
                  value={tempVal}
                  onChange={(e) => { setTempVal(e.target.value); handlePushTelemetry(); }}
                  className="w-full accent-rose-600 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1">
                  <span>16°C (Cool)</span>
                  <span>42°C (Heat Hazard)</span>
                </div>
              </div>

              {/* 4. MQ-2 Smoke & Gas Hazard Trigger (GPIO 34) */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#222228] bg-white dark:bg-[#18181E]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    MQ-2 Gas / Smoke (GPIO 34)
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${gasHazard ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'}`}>
                    {gasHazard ? '245 ppm (ALARM)' : '38 ppm (Safe)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-2">Simulate LPG, smoke, or volatile gas hazard.</p>
                <button
                  onClick={() => { setGasHazard(!gasHazard); handlePushTelemetry(); }}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gasHazard
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-[#FFD000] text-black hover:bg-[#F0C400] shadow-[0_0_12px_rgba(255,208,0,0.25)]'
                  }`}
                >
                  {gasHazard ? '⚠️ Clear Smoke Condition' : '🔥 Trigger Smoke Condition'}
                </button>
              </div>
            </div>

            {/* Context & Timetable Scheduling Overrides */}
            <div className="pt-4 border-t border-slate-200 dark:border-[#222228] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34]">
                <div>
                  <p className="font-bold text-slate-800 dark:text-zinc-200">Scheduled Class Active</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Overrides room into "Class in Session"</p>
                </div>
                <button
                  onClick={() => { setIsClassScheduled(!isClassScheduled); handlePushTelemetry(); }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    isClassScheduled ? 'bg-[#FFD000] text-black shadow-[0_0_12px_rgba(255,208,0,0.25)]' : 'bg-slate-200 dark:bg-[#121217] text-slate-700 dark:text-zinc-400'
                  }`}
                >
                  {isClassScheduled ? 'Active Lecture' : 'No Class'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34]">
                <div>
                  <p className="font-bold text-slate-800 dark:text-zinc-200">ESP32 Device Connectivity</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Toggle Wi-Fi connection heartbeat</p>
                </div>
                <button
                  onClick={() => { setIsNodeOnline(!isNodeOnline); handlePushTelemetry(); }}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    isNodeOnline ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isNodeOnline ? 'Online' : 'Offline'}
                </button>
              </div>
            </div>

            {/* RFID Scanner & Electronic Lock Demonstration */}
            <div className="pt-4 border-t border-slate-200 dark:border-[#222228] space-y-3">
              <h4 className="text-xs font-bold text-[#713F12] dark:text-[#FFD000] uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FFD000]" /> Smart Attendance & Electronic Lock Demo
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34] rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Simulate RFID Card Tap</p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">{rfidLog}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSimulateRfidTap(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Valid Card
                    </button>
                    <button
                      onClick={() => handleSimulateRfidTap(false)}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-2 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Unknown
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-white dark:bg-[#18181E] border border-slate-200 dark:border-[#2C2C34] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${demoLock ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'}`}>
                      {demoLock ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Electronic Demo Lock</p>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                        Relay Pin: GPIO 2 / 21
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${demoLock ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200'}`}>
                    {demoLock ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Evaluation & JSON Telemetry Column */}
        <div className="space-y-5">
          {/* Evaluated Operational State Card */}
          <div className="bg-[#FEF9C3]/20 dark:bg-[#18181E] p-5 rounded-2xl border border-[#FDE047]/40 dark:border-[#222228] shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Evaluated Operational State
            </span>
            <div className="mt-2 p-3 bg-white dark:bg-[#121217] rounded-xl border border-slate-200 dark:border-[#222228]">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full inline-block ${
                  calculatedState === 'Available'
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : calculatedState === 'Occupied – Open Use'
                    ? 'bg-[#FEF9C3] dark:bg-amber-950/40 text-[#713F12] dark:text-amber-300'
                    : calculatedState === 'Class in Session – Unavailable'
                    ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}
              >
                {calculatedState}
              </span>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                {calculatedState === 'Available' && 'No timetable booking exists and sensors detect no movement. Classroom is free for student project work.'}
                {calculatedState === 'Occupied – Open Use' && 'No scheduled lecture, but human presence is detected. Students are using this space for study/projects.'}
                {calculatedState === 'Class in Session – Unavailable' && 'An official faculty class is currently active. The room cannot be booked for open use.'}
                {calculatedState === 'Status Unknown' && 'ESP32 sensor node is offline or readings are stale. Do not assume room is empty.'}
              </p>
            </div>

            <button
              onClick={handlePushTelemetry}
              className="w-full mt-4 bg-[#FFD000] hover:bg-[#F0C400] text-black py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,208,0,0.25)] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Sync Telemetry to System
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1 font-mono">
              Last synced: {lastPacketTime}
            </p>
          </div>

          {/* Real-time MQTT/HTTPS JSON Packet Preview */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-sm font-mono text-[11px] flex flex-col h-[340px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                MQTT/HTTPS TELEMETRY PAYLOAD
              </span>
              <span className="text-[10px]">QoS 1</span>
            </div>
            <pre className="flex-1 overflow-y-auto mt-2 text-slate-300 text-[10px] leading-relaxed">
              {JSON.stringify(currentPayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
