'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// AdminLayout is provided by the layout.tsx file
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalProjects: number;
  publishedBlogs: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    totalProjects: 0,
    publishedBlogs: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch leads stats
      const { data: leads } = await supabase
        .from('leads')
        .select('id, status, created_at')
        .order('created_at', { ascending: false });

      // Fetch projects stats
      const { data: projects } = await supabase
        .from('projects')
        .select('id, is_published, created_at');

      // Fetch blog stats
      const { data: blogs } = await supabase
        .from('blog_posts')
        .select('id, is_published, created_at');

      const totalLeads = leads?.length || 0;
      const newLeads = leads?.filter(lead => lead.status === 'new').length || 0;
      const totalProjects = projects?.length || 0;
      const publishedBlogs = blogs?.filter(blog => blog.is_published).length || 0;

      // Recent activity (last 10 items)
      const recentActivity = [
        ...(leads?.slice(0, 5).map(lead => ({
          type: 'lead',
          title: `New lead received`,
          time: lead.created_at,
          status: lead.status
        })) || []),
        ...(projects?.slice(0, 3).map(project => ({
          type: 'project',
          title: `Project ${project.is_published ? 'published' : 'created'}`,
          time: project.created_at,
          status: project.is_published ? 'published' : 'draft'
        })) || []),
        ...(blogs?.slice(0, 2).map(blog => ({
          type: 'blog',
          title: `Blog post ${blog.is_published ? 'published' : 'created'}`,
          time: blog.created_at,
          status: blog.is_published ? 'published' : 'draft'
        })) || [])
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setStats({
        totalLeads,
        newLeads,
        totalProjects,
        publishedBlogs,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4" />;
      case 'project': return <Briefcase className="w-4 h-4" />;
      case 'blog': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-white/20 pb-6">
          <h1 className="text-4xl font-bold text-accent uppercase tracking-wider mb-2">
            COMMAND CENTER
          </h1>
          <p className="text-gray-400 text-lg">
            Your AI-powered portfolio management system is online.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-white/20 p-6 rounded bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-accent font-bold uppercase tracking-wide text-sm">Total Leads</h3>
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalLeads}</div>
            <p className="text-gray-400 text-sm">
              {stats.newLeads} new this month
            </p>
          </div>

          <div className="border border-white/20 p-6 rounded bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-accent font-bold uppercase tracking-wide text-sm">Projects</h3>
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.totalProjects}</div>
            <p className="text-gray-400 text-sm">
              Portfolio showcase items
            </p>
          </div>

          <div className="border border-white/20 p-6 rounded bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-accent font-bold uppercase tracking-wide text-sm">Blog Posts</h3>
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.publishedBlogs}</div>
            <p className="text-gray-400 text-sm">
              Published articles
            </p>
          </div>

          <div className="border border-white/20 p-6 rounded bg-white/5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-accent font-bold uppercase tracking-wide text-sm">Conversion Rate</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">24%</div>
            <p className="text-gray-400 text-sm">
              Lead to client conversion
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-white/20 rounded bg-white/5">
          <div className="border-b border-white/20 p-6">
            <h2 className="text-xl font-bold text-accent uppercase tracking-wide">
              RECENT ACTIVITY
            </h2>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-white/10 rounded hover:bg-white/5 transition-all">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.time).toLocaleDateString()} at{' '}
                        {new Date(activity.time).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        activity.status === 'new' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        activity.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        activity.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No recent activity detected</p>
                <p className="text-gray-500 text-sm">System monitoring active</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Create Project</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add a new case study to your portfolio with AI assistance
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Write Blog Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create engaging content with AI-powered writing tools
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Review Leads</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage and follow up with potential clients
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}