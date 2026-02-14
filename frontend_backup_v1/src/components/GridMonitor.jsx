import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const GridMonitor = () => {
    const [data, setData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState({ voltage: 0, frequency: 0, entropy: 100, status: "LOADING" });
    const [attackType, setAttackType] = useState(null);

    // Poll for data every 2 seconds
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/grid/status');
                const json = await res.json();

                const now = new Date();
                const timeLabel = now.toLocaleTimeString();

                setCurrentStatus(json);

                setData(prev => {
                    const newData = [...prev, { time: timeLabel, voltage: json.voltage, frequency: json.frequency, entropy: json.entropy }];
                    if (newData.length > 20) newData.shift(); // Keep last 20 points
                    return newData;
                });
            } catch (err) {
                console.error("Failed to fetch grid status:", err);
            }
        };

        const interval = setInterval(fetchData, 2000);
        fetchData(); // Initial call
        return () => clearInterval(interval);
    }, []);

    const triggerAttack = async (type) => {
        try {
            await fetch('http://localhost:3000/api/grid/attack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
            setAttackType(type);
        } catch (err) {
            console.error("Failed to trigger attack:", err);
        }
    };

    const resetSystem = async () => {
        try {
            await fetch('http://localhost:3000/api/grid/reset', { method: 'POST' });
            setAttackType(null);
        } catch (err) {
            console.error("Failed to reset system:", err);
        }
    };

    const isCompromised = currentStatus.status === "COMPROMISED";
    const statusColor = isCompromised ? "bg-red-600" : "bg-emerald-600";
    const statusText = isCompromised ? "GRID UNSTABLE (ATTACK DETECTED)" : "GRID STABLE";

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-2xl">⚡</span> Industrial Grid Monitor
                    </h2>
                    <p className="text-slate-400 text-sm">Real-time SCADA Simulation (Phantom Grid)</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-mono font-bold text-white animate-pulse ${statusColor}`}>
                    {statusText}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Voltage Chart */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-slate-300 font-medium">Voltage (V)</h3>
                        <span className={`text-2xl font-mono ${isCompromised ? 'text-red-400' : 'text-emerald-400'}`}>
                            {Number(currentStatus.voltage).toFixed(1)}V
                        </span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tick={false} />
                                <YAxis domain={[0, 260]} stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <ReferenceLine y={220} stroke="#ca8a04" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="voltage" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Frequency Chart */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-slate-300 font-medium">Frequency (Hz)</h3>
                        <span className={`text-2xl font-mono ${isCompromised ? 'text-red-400' : 'text-emerald-400'}`}>
                            {Number(currentStatus.frequency).toFixed(2)}Hz
                        </span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tick={false} />
                                <YAxis domain={[40, 70]} stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <ReferenceLine y={50} stroke="#ca8a04" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="frequency" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Entropy Chart */}
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="text-slate-300 font-medium">System Entropy (%)</h3>
                        <span className={`text-2xl font-mono ${currentStatus.entropy < 50 ? 'text-red-400' : 'text-purple-400'}`}>
                            {Number(currentStatus.entropy || 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tick={false} />
                                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <ReferenceLine y={50} stroke="#ca8a04" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="entropy" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => triggerAttack('VOLTAGE_DROP')}
                    disabled={isCompromised}
                    className="p-3 bg-red-900/40 hover:bg-red-900/60 border border-red-700/50 text-red-200 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>📉</span> TRIGGER VOLTAGE COLLAPSE
                </button>
                <button
                    onClick={() => triggerAttack('FREQ_SPIKE')}
                    disabled={isCompromised}
                    className="p-3 bg-orange-900/40 hover:bg-orange-900/60 border border-orange-700/50 text-orange-200 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span>📈</span> TRIGGER FREQ INSTABILITY
                </button>
                <button
                    onClick={resetSystem}
                    className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-600"
                >
                    <span>🔄</span> RESET SYSTEM
                </button>
            </div>
        </div>
    );
};

export default GridMonitor;
