import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Zap, Radio, AlertTriangle, RefreshCw, BarChart3 } from 'lucide-react';
import { apiGet, apiPost } from '../api';

const GridMonitor = () => {
    const [data, setData] = useState([]);
    const [currentStatus, setCurrentStatus] = useState({ voltage: 0, frequency: 0, entropy: 100, status: "LOADING" });
    const [attackType, setAttackType] = useState(null);

    // Poll for data every 2 seconds
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use apiGet wrapper which handles Auth if needed, or direct fetch if public
                const json = await apiGet('/api/grid/status');

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
            await apiPost('/api/grid/attack', { type });
            setAttackType(type);
        } catch (err) {
            console.error("Failed to trigger attack:", err);
        }
    };

    const resetSystem = async () => {
        try {
            await apiPost('/api/grid/reset');
            setAttackType(null);
        } catch (err) {
            console.error("Failed to reset system:", err);
        }
    };

    const isCompromised = currentStatus.status === "COMPROMISED";
    const statusColor = isCompromised ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    const statusText = isCompromised ? "GRID UNSTABLE (ATTACK DETECTED)" : "GRID STABLE";

    return (
        <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-xl shadow-black/40">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <span>Industrial Grid Monitor</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Real-time SCADA Simulation (Phantom Grid)</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-mono font-bold text-sm border animate-pulse ${statusColor}`}>
                    {statusText}
                </div>
            </div>

            {/* Graphs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Voltage Chart */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-slate-400 text-sm font-semibold flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-400" /> Voltage (V)
                        </h3>
                        <span className={`text-2xl font-mono font-bold ${isCompromised ? 'text-red-400' : 'text-blue-400'}`}>
                            {Number(currentStatus.voltage).toFixed(1)}V
                        </span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} tick={false} />
                                <YAxis domain={[0, 260]} stroke="#475569" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <ReferenceLine y={220} stroke="#f59e0b" strokeDasharray="3 3" Label="Limit" />
                                <Line type="monotone" dataKey="voltage" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Frequency Chart */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-slate-400 text-sm font-semibold flex items-center gap-2">
                            <Radio className="w-4 h-4 text-emerald-400" /> Frequency (Hz)
                        </h3>
                        <span className={`text-2xl font-mono font-bold ${isCompromised ? 'text-red-400' : 'text-emerald-400'}`}>
                            {Number(currentStatus.frequency).toFixed(2)}Hz
                        </span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} tick={false} />
                                <YAxis domain={[40, 70]} stroke="#475569" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#34d399' }}
                                />
                                <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="frequency" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Entropy Chart */}
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-slate-400 text-sm font-semibold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-purple-400" /> System Entropy (%)
                        </h3>
                        {/* If entropy < 50, it is bad (Quantum Attack) */}
                        <span className={`text-2xl font-mono font-bold ${currentStatus.entropy < 50 ? 'text-red-400' : 'text-purple-400'}`}>
                            {Number(currentStatus.entropy || 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} tick={false} />
                                <YAxis domain={[0, 100]} stroke="#475569" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    itemStyle={{ color: '#a78bfa' }}
                                />
                                <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="entropy" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => triggerAttack('VOLTAGE_DROP')}
                    disabled={isCompromised}
                    className="flex-1 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:text-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold text-xs tracking-wider"
                >
                    <Activity className="w-4 h-4" /> Trigger Voltage Collapse
                </button>
                <button
                    onClick={() => triggerAttack('FREQ_SPIKE')}
                    disabled={isCompromised}
                    className="flex-1 py-3 px-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:text-orange-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold text-xs tracking-wider"
                >
                    <AlertTriangle className="w-4 h-4" /> Trigger Freq Instability
                </button>
                <button
                    onClick={resetSystem}
                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 uppercase font-bold text-xs tracking-wider shadow-lg"
                >
                    <RefreshCw className="w-4 h-4" /> Reset Grid
                </button>
            </div>
        </div>
    );
};

export default GridMonitor;
