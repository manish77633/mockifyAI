import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, DollarSign, Database, Trash2, Ban, CheckCircle, Search, ChevronLeft, ChevronRight, LayoutDashboard, Settings, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  getAdminStats,
  getAdminUsers,
  banAdminUser,
  toggleAdminRole,
  deleteAdminUser,
  getAdminEndpoints,
  deleteAdminEndpoint,
  getAdminRevenue
} from '../utils/api';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState({ users: [], totalUsers: 0, page: 1, totalPages: 1 });
  const [endpointsData, setEndpointsData] = useState({ endpoints: [], totalEndpoints: 0, page: 1, totalPages: 1 });
  const [revenueData, setRevenueData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auth protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (!user.isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  // Data fetching
  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await getAdminStats();
      setStats(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = useCallback(async (page = 1, search = debouncedSearch, filter = userFilter) => {
    try {
      setLoading(true);
      const res = await getAdminUsers(page, 20, search, filter);
      setUsersData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, userFilter]);

  const fetchEndpoints = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAdminEndpoints(page, 20);
      setEndpointsData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load endpoints');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await getAdminRevenue();
      setRevenueData(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load revenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      if (activeTab === 'overview') fetchOverview();
      else if (activeTab === 'users') fetchUsers(1);
      else if (activeTab === 'endpoints') fetchEndpoints(1);
      else if (activeTab === 'revenue') fetchRevenue();
    }
  }, [activeTab, user?.isAdmin, fetchUsers, fetchEndpoints]);

  // Actions
  const handleBanUser = async (userId) => {
    try {
      await banAdminUser(userId);
      fetchUsers(usersData.page);
    } catch (err) {
      alert(err.message || 'Failed to ban user');
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await toggleAdminRole(userId);
      fetchUsers(usersData.page);
    } catch (err) {
      alert(err.message || 'Failed to toggle admin role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to completely delete this user and all their endpoints?')) return;
    try {
      await deleteAdminUser(userId);
      fetchUsers(usersData.page);
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleDeleteEndpoint = async (id) => {
    if (!window.confirm('Are you sure you want to delete this endpoint?')) return;
    try {
      await deleteAdminEndpoint(id);
      fetchEndpoints(endpointsData.page);
    } catch (err) {
      alert(err.message || 'Failed to delete endpoint');
    }
  };

  const handleCardClick = (tab, filter = '') => {
    setUserFilter(filter);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading || (!user?.isAdmin && !loading)) {
    return <div className="min-h-screen flex items-center justify-center bg-void"><div className="w-8 h-8 border-4 border-acid border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const tooltipStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#0f0f0f',
    border: '1px solid var(--border-color, #ffffff20)',
    color: theme === 'light' ? '#0f0f0f' : '#ffffff',
    borderRadius: '8px'
  };

  const renderSkeleton = () => (
    <div className="space-y-4 w-full mt-6">
      <div className="h-24 bg-surface/80 rounded-2xl animate-pulse"></div>
      <div className="h-64 bg-surface/80 rounded-2xl animate-pulse"></div>
      <div className="h-64 bg-surface/80 rounded-2xl animate-pulse"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-void pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text flex items-center gap-2">
              <Settings className="text-acid" /> Admin Center
            </h1>
            <p className="text-xs sm:text-sm text-dim mt-1">Manage users, endpoints, and system analytics.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-center gap-2">
            <Ban size={18} /> {error}
            <button className="ml-auto underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 border-b border-border">
          {[
            { id: 'overview', icon: <LayoutDashboard size={18} />, label: 'Overview' },
            { id: 'users', icon: <Users size={18} />, label: 'Users' },
            { id: 'endpoints', icon: <Database size={18} />, label: 'Endpoints' },
            { id: 'revenue', icon: <DollarSign size={18} />, label: 'Revenue' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'users') setUserFilter('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-acid/10 text-acid border border-acid/20'
                  : 'text-muted hover:text-text hover:bg-surface/50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {loading && !stats && !usersData.users.length ? renderSkeleton() : (
          <div className="space-y-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && stats && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => handleCardClick('users')}
                    className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 shadow-2xl cursor-pointer hover:bg-surface transition-colors"
                  >
                    <p className="text-dim text-xs sm:text-sm font-medium mb-1 flex items-center gap-2"><Users size={16} className="text-acid" /> Total Users</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-text">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-xs text-muted mt-2">+{stats.newUsersThisMonth} this month</p>
                  </div>
                  <div 
                    onClick={() => handleCardClick('users', 'pro')}
                    className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 shadow-2xl cursor-pointer hover:bg-surface transition-colors"
                  >
                    <p className="text-dim text-xs sm:text-sm font-medium mb-1 flex items-center gap-2"><CheckCircle size={16} className="text-sky" /> Pro Users</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-text">{stats.proUsers.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-xs text-muted mt-2">{((stats.proUsers / Math.max(stats.totalUsers, 1)) * 100).toFixed(1)}% of total</p>
                  </div>
                  <div 
                    onClick={() => handleCardClick('endpoints')}
                    className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 shadow-2xl cursor-pointer hover:bg-surface transition-colors"
                  >
                    <p className="text-dim text-xs sm:text-sm font-medium mb-1 flex items-center gap-2"><Database size={16} className="text-acid" /> Total Endpoints</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-text">{stats.totalEndpoints.toLocaleString()}</p>
                  </div>
                  <div 
                    onClick={() => handleCardClick('users', 'banned')}
                    className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 shadow-2xl cursor-pointer hover:bg-surface transition-colors"
                  >
                    <p className="text-dim text-xs sm:text-sm font-medium mb-1 flex items-center gap-2"><Ban size={16} className="text-danger" /> Banned Users</p>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-text">{stats.bannedUsers.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-acid to-transparent opacity-50"></div>
                    <h3 className="text-base sm:text-lg font-medium text-text mb-4 sm:mb-6">User Growth (30 Days)</h3>
                    <div className="h-64 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.userGrowth}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="date" stroke="currentColor" className="text-dim" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                          <YAxis stroke="currentColor" className="text-dim" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Area type="monotone" dataKey="count" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" activeDot={{ r: 6, fill: '#84cc16' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky to-transparent opacity-50"></div>
                    <h3 className="text-base sm:text-lg font-medium text-text mb-4 sm:mb-6">Endpoint Growth (30 Days)</h3>
                    <div className="h-64 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.endpointGrowth}>
                          <defs>
                            <linearGradient id="colorEndpoints" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="date" stroke="currentColor" className="text-dim" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                          <YAxis stroke="currentColor" className="text-dim" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorEndpoints)" activeDot={{ r: 6, fill: '#38bdf8' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-text flex items-center gap-2">
                      User Management
                      {userFilter === 'pro' && <span className="text-xs bg-sky/10 text-sky px-2 py-1 rounded-full border border-sky/20 flex items-center gap-1">Pro Users <button onClick={() => setUserFilter('')} className="hover:text-text"><Trash2 size={12}/></button></span>}
                      {userFilter === 'banned' && <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-full border border-danger/20 flex items-center gap-1">Banned Users <button onClick={() => setUserFilter('')} className="hover:text-text"><Trash2 size={12}/></button></span>}
                    </h3>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="text"
                      placeholder="Search email or username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-void border border-border rounded-lg text-text focus:outline-none focus:border-acid focus:ring-1 focus:ring-acid w-full sm:w-64"
                    />
                  </div>
                </div>
                
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-void/50 border-b border-border text-dim text-xs sm:text-sm">
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">User</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Plan</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Status</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-right whitespace-nowrap">Endpoints</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Joined</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.users.map(u => (
                        <tr key={u._id} className="border-b border-border/50 hover:bg-void/30 transition-colors">
                          <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap">
                            <div className="font-medium text-text text-sm">{u.username} {u.isAdmin && <span className="ml-2 text-[10px] sm:text-xs bg-acid/10 text-acid px-2 py-0.5 rounded border border-acid/20">Admin</span>}</div>
                            <div className="text-xs sm:text-sm text-dim truncate max-w-[150px] sm:max-w-xs">{u.email}</div>
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap">
                            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full border ${u.isPro ? 'bg-sky/10 text-sky border-sky/20' : 'bg-surface border-border text-muted'}`}>
                              {u.isPro ? 'Pro' : 'Free'}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap">
                            <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full border ${u.isBanned ? 'bg-danger/10 text-danger border-danger/20' : 'bg-acid/10 text-acid border-acid/20'}`}>
                              {u.isBanned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-right text-text font-mono text-xs sm:text-sm whitespace-nowrap">
                            {u.endpointCount}
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-dim whitespace-nowrap">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 sm:py-4 px-4 sm:px-6 text-right space-x-2 sm:space-x-3 whitespace-nowrap">
                            <button 
                              onClick={() => handleToggleAdmin(u._id)}
                              disabled={u._id === user._id}
                              className={`text-sm font-medium ${u.isAdmin ? 'text-yellow-400 hover:text-yellow-400/80' : 'text-sky hover:text-sky/80'} disabled:opacity-30`}
                              title={u.isAdmin ? "Remove Admin" : "Make Admin"}
                            >
                              <Shield size={16} className="inline mr-1"/>
                              {u.isAdmin ? 'Demote' : 'Promote'}
                            </button>
                            <button 
                              onClick={() => handleBanUser(u._id)}
                              disabled={u.isAdmin || u._id === user._id}
                              className={`text-sm font-medium ${u.isBanned ? 'text-acid hover:text-acid/80' : 'text-danger hover:text-danger/80'} disabled:opacity-30`}
                            >
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={u.isAdmin || u._id === user._id}
                              className="text-sm font-medium text-danger hover:text-danger/80 disabled:opacity-30"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="block md:hidden space-y-3 p-4">
                  {usersData.users.map(u => (
                    <div key={u._id} className="bg-void/50 border border-border rounded-xl p-4 flex flex-col gap-3">
                      <div>
                        <div className="font-medium text-text text-sm flex items-center gap-2">
                          {u.username}
                          {u.isAdmin && <span className="text-[10px] bg-acid/10 text-acid px-2 py-0.5 rounded border border-acid/20">Admin</span>}
                        </div>
                        <div className="text-xs text-dim truncate">{u.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full border ${u.isPro ? 'bg-sky/10 text-sky border-sky/20' : 'bg-surface border-border text-muted'}`}>
                          {u.isPro ? 'Pro' : 'Free'}
                        </span>
                        <span className={`text-[10px] px-2 py-1 rounded-full border ${u.isBanned ? 'bg-danger/10 text-danger border-danger/20' : 'bg-acid/10 text-acid border-acid/20'}`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                        <span className="text-xs text-dim ml-auto text-right">{u.endpointCount} Endpoints</span>
                      </div>
                      <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                        <button 
                          onClick={() => handleToggleAdmin(u._id)}
                          disabled={u._id === user._id}
                          className={`text-xs font-medium ${u.isAdmin ? 'text-yellow-400' : 'text-sky'} disabled:opacity-30`}
                        >
                          {u.isAdmin ? 'Demote' : 'Promote'}
                        </button>
                        <button 
                          onClick={() => handleBanUser(u._id)}
                          disabled={u.isAdmin || u._id === user._id}
                          className={`text-xs font-medium ${u.isBanned ? 'text-acid' : 'text-danger'} disabled:opacity-30`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={u.isAdmin || u._id === user._id}
                          className="text-xs font-medium text-danger disabled:opacity-30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between bg-void/30">
                  <span className="text-sm text-dim">Page {usersData.page} of {usersData.totalPages}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={usersData.page <= 1}
                      onClick={() => fetchUsers(usersData.page - 1)}
                      className="p-1 rounded bg-surface border border-border text-text disabled:opacity-50 hover:bg-void"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      disabled={usersData.page >= usersData.totalPages}
                      onClick={() => fetchUsers(usersData.page + 1)}
                      className="p-1 rounded bg-surface border border-border text-text disabled:opacity-50 hover:bg-void"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ENDPOINTS TAB */}
            {activeTab === 'endpoints' && (
              <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-medium text-text">Global Endpoints</h3>
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-void/50 border-b border-border text-dim text-xs sm:text-sm">
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Slug</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Method</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Owner</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium whitespace-nowrap">Created</th>
                        <th className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpointsData.endpoints.map(ep => {
                        const methodColors = {
                          GET: 'text-sky bg-sky/10 border-sky/20',
                          POST: 'text-acid bg-acid/10 border-acid/20',
                          DELETE: 'text-danger bg-danger/10 border-danger/20',
                          PUT: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                        };
                        return (
                          <tr key={ep._id} className="border-b border-border/50 hover:bg-void/30 transition-colors">
                            <td className="py-3 sm:py-4 px-4 sm:px-6 font-mono text-xs sm:text-sm text-text whitespace-nowrap max-w-[150px] sm:max-w-xs truncate">
                              /{ep.endpoint}
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 whitespace-nowrap">
                              <span className={`text-[10px] sm:text-xs font-mono px-2 py-1 rounded border ${methodColors[ep.httpMethod] || 'text-muted bg-surface border-border'}`}>
                                {ep.httpMethod}
                              </span>
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-text whitespace-nowrap">
                              {ep.owner?.username || 'Unknown'}
                              <div className="text-[10px] sm:text-xs text-dim truncate max-w-[120px] sm:max-w-[200px]">{ep.owner?.email || ''}</div>
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm text-dim whitespace-nowrap">
                              {new Date(ep.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                              <button 
                                onClick={() => handleDeleteEndpoint(ep._id)}
                                className="text-xs sm:text-sm font-medium text-danger hover:text-danger/80"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="block md:hidden space-y-3 p-4">
                  {endpointsData.endpoints.map(ep => {
                    const methodColors = {
                      GET: 'text-sky bg-sky/10 border-sky/20',
                      POST: 'text-acid bg-acid/10 border-acid/20',
                      DELETE: 'text-danger bg-danger/10 border-danger/20',
                      PUT: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                    };
                    return (
                      <div key={ep._id} className="bg-void/50 border border-border rounded-xl p-4 flex flex-col gap-3">
                        <div className="font-mono text-sm text-text truncate">
                          /{ep.endpoint}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-1 rounded border ${methodColors[ep.httpMethod] || 'text-muted bg-surface border-border'}`}>
                            {ep.httpMethod}
                          </span>
                          <span className="text-xs text-text">{ep.owner?.username || 'Unknown'}</span>
                          <span className="text-xs text-dim ml-auto">{new Date(ep.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-end pt-2 border-t border-border/50">
                          <button 
                            onClick={() => handleDeleteEndpoint(ep._id)}
                            className="text-xs font-medium text-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between bg-void/30">
                  <span className="text-sm text-dim">Page {endpointsData.page} of {endpointsData.totalPages}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={endpointsData.page <= 1}
                      onClick={() => fetchEndpoints(endpointsData.page - 1)}
                      className="p-1 rounded bg-surface border border-border text-text disabled:opacity-50 hover:bg-void"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      disabled={endpointsData.page >= endpointsData.totalPages}
                      onClick={() => fetchEndpoints(endpointsData.page + 1)}
                      className="p-1 rounded bg-surface border border-border text-text disabled:opacity-50 hover:bg-void"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REVENUE TAB */}
            {activeTab === 'revenue' && revenueData && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 shadow-2xl flex items-center">
                    <div className="p-3 sm:p-4 rounded-full bg-acid/10 border border-acid/20 mr-4">
                      <DollarSign className="text-acid" size={20} />
                    </div>
                    <div>
                      <p className="text-dim text-xs sm:text-sm font-medium">All-time Revenue</p>
                      <p className="text-2xl sm:text-3xl font-display font-bold text-text">${revenueData.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-5 sm:p-6 shadow-2xl flex items-center">
                    <div className="p-3 sm:p-4 rounded-full bg-sky/10 border border-sky/20 mr-4">
                      <Activity className="text-sky" size={20} />
                    </div>
                    <div>
                      <p className="text-dim text-xs sm:text-sm font-medium">Monthly Revenue</p>
                      <p className="text-2xl sm:text-3xl font-display font-bold text-text">${revenueData.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl mt-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-acid via-sky to-acid opacity-50"></div>
                  <h3 className="text-base sm:text-lg font-medium text-text mb-4 sm:mb-6">Revenue Growth (30 Days)</h3>
                  <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData.last30Days}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="date" stroke="currentColor" className="text-dim" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                        <YAxis stroke="currentColor" className="text-dim" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`$${val}`, 'Revenue']} />
                        <Area type="monotone" dataKey="amount" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, fill: '#84cc16' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
