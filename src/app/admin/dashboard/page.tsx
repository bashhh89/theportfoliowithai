'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, FileText, Users, Image, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalProjects: number
  publishedProjects: number
  totalBlogs: number
  publishedBlogs: number
  totalLeads: number
  hotLeads: number
  mediaFiles: number
  aiGenerations: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalLeads: 0,
    hotLeads: 0,
    mediaFiles: 0,
    aiGenerations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch projects stats
      const { data: projects } = await supabase
        .from('projects')
        .select('is_published')
      
      // Fetch blog stats
      const { data: blogs } = await supabase
        .from('blog_posts')
        .select('is_published')
      
      // Fetch leads stats
      const { data: leads } = await supabase
        .from('leads')
        .select('score')
      
      // Fetch media stats
      const { data: media } = await supabase
        .from('media_files')
        .select('id')
      
      // Fetch AI generations stats
      const { data: aiGens } = await supabase
        .from('ai_generations')
        .select('id')

      setStats({
        totalProjects: projects?.length || 0,
        publishedProjects: projects?.filter(p => p.is_published).length || 0,
        totalBlogs: blogs?.length || 0,
        publishedBlogs: blogs?.filter(b => b.is_published).length || 0,
        totalLeads: leads?.length || 0,
        hotLeads: leads?.filter(l => l.score === 'hot').length || 0,
        mediaFiles: media?.length || 0,
        aiGenerations: aiGens?.length || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your portfolio and content</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/projects/new">
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
              <Link href="/admin/blog/new">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  New Blog Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Projects Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedProjects} published
              </p>
            </CardContent>
          </Card>

          {/* Blog Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBlogs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedBlogs} published
              </p>
            </CardContent>
          </Card>

          {/* Leads Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                {stats.hotLeads} hot leads
              </p>
            </CardContent>
          </Card>

          {/* AI Usage Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiGenerations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.mediaFiles} media files
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full justify-start">
                  Manage Projects
                </Button>
              </Link>
              <Link href="/admin/projects/new">
                <Button className="w-full justify-start bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create with AI
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Blog Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Blog
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/blog">
                <Button variant="outline" className="w-full justify-start">
                  Manage Blog Posts
                </Button>
              </Link>
              <Link href="/admin/blog/new">
                <Button className="w-full justify-start bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Write with AI
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Leads Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Leads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/leads">
                <Button variant="outline" className="w-full justify-start">
                  View All Leads
                </Button>
              </Link>
              <div className="flex gap-2">
                <Badge variant="secondary">{stats.hotLeads} Hot</Badge>
                <Badge variant="outline">{stats.totalLeads - stats.hotLeads} Others</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}