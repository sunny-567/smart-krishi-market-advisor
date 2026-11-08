"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ShieldCheck, UserCheck, ShoppingCart, Search, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SampleDataBadge } from "@/components/SampleDataBadge";
import { ReadAloudButton } from "@/components/ReadAloudButton";

export default function UserManagementPage() {
  const [userList, setUserList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.users) setUserList(d.users);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch {
      console.error("Failed to update user role");
    }
  };

  const filtered = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.location && u.location.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
            <span>•</span>
            <SampleDataBadge />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            User Management & Role Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Oversee farmer profiles, bulk procurement aggregators, and system agronomists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton
            text={`User Management Portal. Total registered users: ${userList.length}. Displays registered farmers, wholesale buyers, and agronomists.`}
            size="md"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="all">All Roles ({userList.length})</option>
            <option value="farmer">Farmers</option>
            <option value="buyer">Buyers / Traders</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            Registered Directory Accounts ({filtered.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">PostgreSQL Authentication Table</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">User Name</th>
                <th className="py-3.5 px-4">Email / Phone</th>
                <th className="py-3.5 px-4">Operating Location</th>
                <th className="py-3.5 px-4">Role Badge</th>
                <th className="py-3.5 px-4">Profile Specifics</th>
                <th className="py-3.5 px-4 text-right">Role Reassignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                    <span className="block text-[10px] text-slate-400">
                      Created: {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 font-mono">{u.email}</span>
                    <span className="block text-[11px] text-slate-500 font-mono">{u.phone || "—"}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-slate-700 font-medium">{u.location || "Hyderabad"}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : u.role === "buyer"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    {u.farmerDetails ? (
                      <span className="text-[11px] text-slate-600 block">
                        Land: {u.farmerDetails.farmSizeAcres} Acres • Crops: {u.farmerDetails.primaryCrops}
                      </span>
                    ) : u.buyerDetails ? (
                      <span className="text-[11px] text-slate-600 block">
                        Company: {u.buyerDetails.companyName} • Cap: {u.buyerDetails.procurementCapacityTonnes}t
                      </span>
                    ) : (
                      <span className="text-[11px] text-purple-700 font-semibold block">
                        Agronomist / State Marketing Officer
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="buyer">Buyer</option>
                      <option value="admin">Admin</option>
                    </select>
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
