import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Lightbulb,
  BarChart3,
  Filter,
  ArrowUp,
  ArrowDown,
  Zap,
  CheckCircle,
  AlertTriangle,
  Star,
  Award
} from 'lucide-react';

interface SuccessFactor {
  factor: string;
  correlation: number;
  impact_description: string;
  confidence_level: 'high' | 'medium' | 'low';
  category: 'marketing' | 'operational' | 'financial' | 'customer_experience' | 'external';
  trend: 'positive' | 'negative';
}

interface Recommendation {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  category: string;
  expectedOutcome: string;
}

interface SuccessFactorAnalysisProps {
  factors: SuccessFactor[];
  onGenerateRecommendations?: () => void;
  showRecommendations?: boolean;
}

const SuccessFactorAnalysis: React.FC<SuccessFactorAnalysisProps> = ({
  factors = [],
  onGenerateRecommendations,
  showRecommendations = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'correlation' | 'impact' | 'category'>('correlation');

  // Mock success factors if none provided
  const mockFactors: SuccessFactor[] = [
    {
      factor: 'Marketing Lead Time',
      correlation: 0.82,
      impact_description: 'Events with 45+ day marketing lead time show 32% higher attendance rates',
      confidence_level: 'high',
      category: 'marketing',
      trend: 'positive'
    },
    {
      factor: 'Social Media Engagement',
      correlation: 0.76,
      impact_description: 'High social media engagement correlates with 28% increase in ticket sales',
      confidence_level: 'high',
      category: 'marketing',
      trend: 'positive'
    },
    {
      factor: 'Venue Capacity Utilization',
      correlation: 0.71,
      impact_description: 'Optimal 85-90% capacity utilization maximizes revenue and satisfaction',
      confidence_level: 'high',
      category: 'operational',
      trend: 'positive'
    },
    {
      factor: 'Staff-to-Attendee Ratio',
      correlation: 0.68,
      impact_description: 'Proper staffing levels (1:25 ratio) improve customer experience scores by 22%',
      confidence_level: 'medium',
      category: 'operational',
      trend: 'positive'
    },
    {
      factor: 'Pricing Strategy',
      correlation: 0.65,
      impact_description: 'Competitive pricing within 10% of market average drives optimal conversion',
      confidence_level: 'medium',
      category: 'financial',
      trend: 'positive'
    },
    {
      factor: 'Weather Conditions',
      correlation: 0.45,
      impact_description: 'Clear weather conditions increase outdoor event attendance by 15%',
      confidence_level: 'medium',
      category: 'external',
      trend: 'positive'
    },
    {
      factor: 'Event Duration',
      correlation: -0.38,
      impact_description: 'Events longer than 4 hours show decreased satisfaction scores',
      confidence_level: 'low',
      category: 'operational',
      trend: 'negative'
    }
  ];

  const analysisFactors = factors.length > 0 ? factors : mockFactors;

  // Generate recommendations based on success factors
  const recommendations: Recommendation[] = useMemo(() => {
    const recs: Recommendation[] = [];
    
    analysisFactors.forEach(factor => {
      if (Math.abs(factor.correlation) > 0.6 && factor.confidence_level !== 'low') {
        switch (factor.factor) {
          case 'Marketing Lead Time':
            recs.push({
              title: 'Extend Marketing Timeline',
              description: 'Start promotional campaigns at least 45 days before events to maximize reach and conversion',
              impact: 'high',
              effort: 'low',
              priority: 1,
              category: 'Marketing',
              expectedOutcome: '20-30% increase in advance ticket sales'
            });
            break;
          case 'Social Media Engagement':
            recs.push({
              title: 'Boost Social Media Strategy',
              description: 'Invest in engaging content creation, influencer partnerships, and community interaction',
              impact: 'high',
              effort: 'medium',
              priority: 2,
              category: 'Marketing',
              expectedOutcome: '25% improvement in organic reach and engagement'
            });
            break;
          case 'Venue Capacity Utilization':
            recs.push({
              title: 'Optimize Venue Selection',
              description: 'Choose venues that allow for 85-90% capacity utilization for optimal revenue and atmosphere',
              impact: 'medium',
              effort: 'medium',
              priority: 3,
              category: 'Operations',
              expectedOutcome: '15% increase in revenue per event'
            });
            break;
          case 'Staff-to-Attendee Ratio':
            recs.push({
              title: 'Right-size Event Staffing',
              description: 'Maintain optimal 1:25 staff-to-attendee ratio for superior customer experience',
              impact: 'medium',
              effort: 'low',
              priority: 4,
              category: 'Operations',
              expectedOutcome: '20% improvement in customer satisfaction scores'
            });
            break;
        }
      }
    });
    
    return recs.sort((a, b) => a.priority - b.priority);
  }, [analysisFactors]);

  // Filter and sort factors
  const filteredFactors = useMemo(() => {
    let filtered = analysisFactors;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(factor => factor.category === selectedCategory);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'correlation':
          return Math.abs(b.correlation) - Math.abs(a.correlation);
        case 'impact':
          return b.confidence_level === 'high' ? 1 : -1;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [analysisFactors, selectedCategory, sortBy]);

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return correlation > 0 ? 'text-green-600' : 'text-red-600';
    if (abs >= 0.5) return correlation > 0 ? 'text-blue-600' : 'text-orange-600';
    if (abs >= 0.3) return correlation > 0 ? 'text-yellow-600' : 'text-yellow-600';
    return 'text-gray-500';
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.5) return 'Moderate';
    if (abs >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const categories = ['all', 'marketing', 'operational', 'financial', 'customer_experience', 'external'];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-brand-primary" />
              Success Factor Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-border rounded px-3 py-1 bg-background"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-border rounded px-3 py-1 bg-background"
              >
                <option value="correlation">Sort by Correlation</option>
                <option value="impact">Sort by Impact</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredFactors.filter(f => Math.abs(f.correlation) >= 0.7).length}
              </div>
              <div className="text-sm text-green-600 font-medium">Strong Correlations</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredFactors.filter(f => f.confidence_level === 'high').length}
              </div>
              <div className="text-sm text-blue-600 font-medium">High Confidence</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {recommendations.length}
              </div>
              <div className="text-sm text-purple-600 font-medium">Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Factors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-primary" />
            Key Success Factors
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {filteredFactors.map((factor, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{factor.factor}</h4>
                    <Badge variant="outline" className={getConfidenceColor(factor.confidence_level)}>
                      {factor.confidence_level} confidence
                    </Badge>
                    <Badge variant="outline">
                      {factor.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {factor.impact_description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getCorrelationColor(factor.correlation)}`}>
                    {factor.correlation > 0 ? '+' : ''}{(factor.correlation * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getCorrelationStrength(factor.correlation)} {factor.trend === 'positive' ? 'Positive' : 'Negative'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress 
                    value={Math.abs(factor.correlation) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {factor.trend === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {Math.abs(factor.correlation).toFixed(2)} correlation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations Engine */}
      {showRecommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-brand-primary" />
              AI-Generated Recommendations
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <Badge className={`${getImpactColor(rec.impact)} font-medium`}>
                        {rec.impact} impact
                      </Badge>
                      <Badge variant="outline">
                        {rec.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>Expected: {rec.expectedOutcome}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={getEffortColor(rec.effort)}>
                          {rec.effort} effort required
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary/10 mb-1">
                      <span className="text-lg font-bold text-brand-primary">#{rec.priority}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Priority</div>
                  </div>
                </div>
              </div>
            ))}
            
            {onGenerateRecommendations && (
              <div className="text-center pt-4">
                <Button onClick={onGenerateRecommendations} variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generate More Recommendations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-primary" />
            Key Insights
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Top Performance Drivers
              </h4>
              <div className="space-y-2">
                {filteredFactors
                  .filter(f => f.correlation > 0.6 && f.trend === 'positive')
                  .slice(0, 3)
                  .map((factor, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                      <Star className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-800">{factor.factor}</span>
                      <Badge variant="outline" className="text-xs">
                        +{(factor.correlation * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Areas for Attention
              </h4>
              <div className="space-y-2">
                {filteredFactors
                  .filter(f => f.correlation < -0.3 || f.confidence_level === 'low')
                  .slice(0, 3)
                  .map((factor, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <span className="text-sm text-orange-800">{factor.factor}</span>
                      <Badge variant="outline" className="text-xs">
                        {factor.correlation < 0 ? 'Negative' : 'Low Confidence'}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessFactorAnalysis; 