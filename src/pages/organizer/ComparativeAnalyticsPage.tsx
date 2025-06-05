import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Share2, 
  RefreshCw, 
  Calendar,
  Target,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';
import { useComparativeAnalytics } from '@/hooks/useComparativeAnalytics';
import EventComparisonSelector from '@/components/analytics/EventComparisonSelector';
import ComparisonChartsSection from '@/components/analytics/ComparisonChartsSection';
import PerformanceMetricsTable from '@/components/analytics/PerformanceMetricsTable';
import { toast } from 'sonner';

const ComparativeAnalyticsPage: React.FC = () => {
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'event_to_event' | 'time_period' | 'venue_comparison' | 'category_analysis'>('event_to_event');
  const [activeTab, setActiveTab] = useState('selector');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const {
    currentComparison,
    benchmarks,
    performanceScore,
    loading,
    comparingEvents,
    fetchingBenchmarks,
    error,
    compareEvents,
    fetchIndustryBenchmarks,
    calculatePerformanceScore,
    refreshAllData,
    clearAnalysis,
    exportComparison,
    hasComparison
  } = useComparativeAnalytics({ autoRefresh, refreshInterval: 300000 });

  // Handle event selection and automatic comparison
  useEffect(() => {
    if (selectedEventIds.length >= 2 && !comparingEvents) {
      handleCompareEvents();
    }
  }, [selectedEventIds]);

  const handleCompareEvents = async () => {
    if (selectedEventIds.length < 2) {
      toast.error('Please select at least 2 events to compare');
      return;
    }

    const comparison = await compareEvents(selectedEventIds);
    if (comparison) {
      setActiveTab('charts');
    }
  };

  const handleExportReport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (!currentComparison) {
      toast.error('No comparison data to export');
      return;
    }

    try {
      await exportComparison(currentComparison, format);
    } catch (error) {
      toast.error(`Failed to export ${format.toUpperCase()} report`);
    }
  };

  const handleShareInsights = async () => {
    if (!currentComparison) return;

    try {
      const shareData = {
        title: `Event Comparison: ${currentComparison.name}`,
        text: `Check out this event performance comparison with ${currentComparison.events.length} events analyzed.`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Comparison link copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share insights');
    }
  };

  const getComparisonSummary = () => {
    if (!currentComparison) return null;

    const bestPerformer = currentComparison.insights.best_performer;
    const worstPerformer = currentComparison.insights.worst_performer;
    const keyDifferences = currentComparison.insights.key_differences;

    return {
      bestPerformer,
      worstPerformer,
      totalRevenue: currentComparison.events.reduce((sum, event) => sum + event.revenue.gross, 0),
      avgAttendance: currentComparison.events.reduce((sum, event) => sum + event.metrics.attendance_rate, 0) / currentComparison.events.length,
      totalAttendees: currentComparison.events.reduce((sum, event) => sum + event.tickets_sold, 0),
      highImpactDifferences: keyDifferences.filter(diff => diff.significance === 'high').length
    };
  };

  const summary = getComparisonSummary();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Comparative Analytics & Benchmarking
              </h1>
              <p className="text-lg text-muted-foreground">
                Compare event performance, analyze trends, and benchmark against industry standards
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>
              
              {hasComparison && (
                <>
                  <Button variant="outline" onClick={handleShareInsights}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport('csv')}
                    >
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport('excel')}
                    >
                      Excel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport('pdf')}
                    >
                      PDF
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${summary.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.totalAttendees.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.avgAttendance.toFixed(1)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Key Insights</p>
                    <p className="text-2xl font-bold text-foreground">
                      {summary.highImpactDifferences}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="selector" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={!hasComparison} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="metrics" disabled={!hasComparison} className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="trends" disabled={!hasComparison} className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="benchmarks" disabled={!hasComparison} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Benchmarks
            </TabsTrigger>
            <TabsTrigger value="reports" disabled={!hasComparison} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Event Selection */}
          <TabsContent value="selector" className="space-y-6">
            <EventComparisonSelector
              selectedEventIds={selectedEventIds}
              onEventsSelected={setSelectedEventIds}
              comparisonType={comparisonType}
              onComparisonTypeChange={setComparisonType}
              maxSelections={10}
            />
            
            {selectedEventIds.length >= 2 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Ready to Compare {selectedEventIds.length} Events
                      </h3>
                      <p className="text-muted-foreground">
                        Click "Generate Comparison" to analyze performance metrics and insights
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleCompareEvents}
                      disabled={comparingEvents}
                      size="lg"
                    >
                      {comparingEvents ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Generate Comparison
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Comparison Charts */}
          <TabsContent value="charts" className="space-y-6">
            {currentComparison ? (
              <ComparisonChartsSection 
                comparison={currentComparison}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Comparison Data
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Select events in the Setup tab to generate comparison charts
                  </p>
                  <Button onClick={() => setActiveTab('selector')}>
                    Select Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Metrics Table */}
          <TabsContent value="metrics" className="space-y-6">
            {currentComparison ? (
              <PerformanceMetricsTable 
                comparison={currentComparison}
                onExport={() => handleExportReport('csv')}
                showCalculations={true}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Metrics Data
                  </h3>
                  <p className="text-muted-foreground">
                    Generate a comparison to view detailed performance metrics
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trend Analysis */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-primary" />
                  Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Trend Analysis Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Seasonal trends, year-over-year analysis, and optimal timing recommendations
                  </p>
                  <Badge variant="secondary" className="mt-4">
                    In Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Industry Benchmarks */}
          <TabsContent value="benchmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-brand-primary" />
                  Industry Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Industry Benchmarks Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    Compare your events against anonymous industry data and market positioning
                  </p>
                  <Badge variant="secondary" className="mt-4">
                    In Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports and Export */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Comparison Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Download your comparison analysis in various formats for external use
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportReport('csv')}
                      disabled={!hasComparison || loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportReport('excel')}
                      disabled={!hasComparison || loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportReport('pdf')}
                      disabled={!hasComparison || loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Automated Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Set up automated comparison reports for regular performance reviews
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Weekly Performance Summary</div>
                        <div className="text-sm text-muted-foreground">Every Monday at 9 AM</div>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Monthly Benchmark Report</div>
                        <div className="text-sm text-muted-foreground">First of each month</div>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Quarterly Business Review</div>
                        <div className="text-sm text-muted-foreground">End of each quarter</div>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        {hasComparison && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Comparison Analysis Complete
                  </h3>
                  <p className="text-muted-foreground">
                    {currentComparison?.events.length} events analyzed • Generated {new Date(currentComparison?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={refreshAllData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </Button>
                  
                  <Button variant="outline" onClick={clearAnalysis}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComparativeAnalyticsPage; 