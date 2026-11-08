"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Sprout,
  BarChart3,
  PhoneCall,
  Edit,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<any | null>(null);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected callback for status update
  const [editingCallback, setEditingCallback] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("Assigned");
  const [adminNote, setAdminNote] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");

  const fetchAdminData = () => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.stats) setStats(d.stats);
      });

    const param = statusFilter !== "all" ? `?status=${statusFilter}` : "";
    fetch(`/api/callback-requests${param}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.callbacks) setCallbacks(d.callbacks);
      });
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter]);

  const handleUpdateCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCallback) return;

    try {
      const res = await fetch("/api/callback-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCallback.id,
          status: newStatus,
          adminNotes: adminNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdateMsg("Callback status updated successfully!");
        setEditingCallback(null);
        fetchAdminData();
        setTimeout(() => setUpdateMsg(""), 4000);
      }
    } catch {
      console.error("Failed to update callback");
    }
  };

  const adminSpeech = `Admin Command Center for Dr. K. Srinivas. Total registered users: ${stats?.totalUsers || 5}. Monitored crops: ${stats?.totalMonitoredCrops || 12}. Pending farmer callback requests: ${stats?.pendingCallbacks || 2}. You can assign agricultural officers and track response workflows.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-800/80 px-2.5 py-0.5 rounded-full border border-purple-600/40">
              Administrative Control Center
            </span>
            <SampleDataBadge className="bg-slate-950 text-amber-200 border-amber-400/40" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Directorate of Agricultural Marketing
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1">
            Logged in as: <strong>{user?.name || "Dr. K. Srinivas (Agronomist / Admin)"}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ReadAloudButton text={adminSpeech} size="md" className="bg-purple-950 text-purple-100 border-purple-700" />
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Manage Users ({stats?.totalUsers || 5})</span>
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Full Analytics Report</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Registered Users</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers || 5}</h3>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {stats?.farmerCount || 2} Farmers • {stats?.buyerCount || 2} Buyers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Crops in Registry</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalMonitoredCrops || 12}</h3>
          <span className="text-[11px] text-slate-500">Across 7 APMC Mandis</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Pending Callbacks</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{stats?.pendingCallbacks || 2}</h3>
          <span className="text-[11px] text-amber-700 font-semibold">Requires Officer Action</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Active Produce Lots</p>
          <h3 className="text-2xl font-black text-emerald-700 mt-1">{stats?.activeProduceListings || 3}</h3>
          <span className="text-[11px] text-emerald-600 font-semibold">Grade A verified</span>
        </div>
      </div>

      {updateMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* Callback Management Module (Section 14 Requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-purple-600" />
              <span>Farmer Callback Requests Management System</span>
            </h3>
            <p className="text-xs text-slate-500">
              Filter by status, assign agricultural officers, update call state, and log internal consultation notes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white font-medium"
            >
              <option value="all">All Statuses ({callbacks.length})</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="calling">Calling</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Modal / Inline Update Form */}
        {editingCallback && (
          <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
              <span className="font-bold text-purple-950 text-sm">
                Update Callback Request for: {editingCallback.farmerName} ({editingCallback.phoneNumber})
              </span>
              <button
                onClick={() => setEditingCallback(null)}
                className="text-slate-500 hover:text-slate-800 font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdateCallback} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned to Officer</option>
                  <option value="Calling">Calling (In Progress)</option>
                  <option value="Completed">Completed / Resolved</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Internal Officer Notes</label>
                <input
                  type="text"
                  required
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Advised farmer on mandi price difference vs freight..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Save Status & Notes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Callback Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Farmer Details</th>
                <th className="py-3 px-4">Query Reason</th>
                <th className="py-3 px-4">Preferred Slot / Language</th>
                <th className="py-3 px-4 text-center">Current Status</th>
                <th className="py-3 px-4">Officer Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {callbacks.map((cb) => (
                <tr key={cb.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 text-sm">{cb.farmerName}</span>
                    <span className="block text-[11px] text-slate-500 font-mono">{cb.phoneNumber}</span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-700 leading-relaxed font-medium line-clamp-2">{cb.reason}</p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{cb.preferredTime}</span>
                    <span className="block text-[10px] text-slate-400">Lang: {cb.preferredLanguage}</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        cb.status === "Completed"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : cb.status === "Calling"
                          ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse"
                          : cb.status === "Assigned"
                          ? "bg-purple-100 text-purple-800 border border-purple-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {cb.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <span className="text-[11px] text-slate-600 italic">
                      {cb.adminNotes || "No notes recorded yet."}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingCallback(cb);
                        setNewStatus(cb.status || "Assigned");
                        setAdminNote(cb.adminNotes || "");
                      }}
                      className="inline-flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg font-bold border border-purple-200 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
