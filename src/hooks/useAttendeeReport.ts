import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  attendeeReportService, 
  AttendeeReportInfo, 
  AttendeeAnalytics, 
  AttendeeFilterOptions, 
  BulkOperation, 
  ExportConfig,
  PrivacyAuditRecord
} from '../services/attendeeReportService';

interface UseAttendeeReportResult {
  // Data
  attendees: AttendeeReportInfo[];
  analytics: AttendeeAnalytics | null;
  selectedAttendees: string[];
  filteredCount: number;
  
  // Loading states
  isLoading: boolean;
  isExporting: boolean;
  isPerformingBulkOperation: boolean;
  isRefreshing: boolean;
  
  // Error states
  error: string | null;
  exportError: string | null;
  
  // Filters and search
  filters: AttendeeFilterOptions;
  searchQuery: string;
  
  // Actions
  loadAttendees: (eventId: string, staffId?: string, justification?: string) => Promise<void>;
  refreshAttendees: () => Promise<void>;
  searchAttendees: (query: string, fields?: string[]) => Promise<void>;
  updateFilters: (newFilters: Partial<AttendeeFilterOptions>) => void;
  clearFilters: () => void;
  
  // Selection management
  selectAttendee: (attendeeId: string) => void;
  deselectAttendee: (attendeeId: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleAttendeeSelection: (attendeeId: string) => void;
  
  // Individual attendee operations
  getAttendeeDetails: (attendeeId: string) => Promise<AttendeeReportInfo | null>;
  updateAttendee: (attendeeId: string, updates: Partial<AttendeeReportInfo>, justification: string) => Promise<boolean>;
  
  // Bulk operations
  performBulkOperation: (operation: Omit<BulkOperation, 'attendeeIds'>) => Promise<boolean>;
  
  // Export functionality
  exportAttendees: (config: Omit<ExportConfig, 'filterOptions'>, justification: string) => Promise<void>;
  
  // Privacy and compliance
  getPrivacyAuditLog: (attendeeId?: string, dateRange?: { start: Date; end: Date }) => Promise<PrivacyAuditRecord[]>;
  
  // Utility functions
  getFilteredAttendees: () => AttendeeReportInfo[];
  getAttendeeCount: () => number;
  getCheckedInCount: () => number;
  getVIPCount: () => number;
}

export const useAttendeeReport = (
  eventId: string,
  staffId?: string,
  autoLoad: boolean = true
): UseAttendeeReportResult => {
  // State management
  const [attendees, setAttendees] = useState<AttendeeReportInfo[]>([]);
  const [analytics, setAnalytics] = useState<AttendeeAnalytics | null>(null);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPerformingBulkOperation, setIsPerformingBulkOperation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AttendeeFilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Load attendees data
  const loadAttendees = useCallback(async (
    eventIdToLoad: string, 
    staffIdToUse?: string, 
    justification?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await attendeeReportService.getAttendees(
        eventIdToLoad, 
        filters, 
        staffIdToUse || staffId, 
        justification
      );

      setAttendees(result.attendees);
      setAnalytics(result.analytics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load attendees';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters, staffId]);

  // Refresh attendees data
  const refreshAttendees = useCallback(async () => {
    if (!eventId) return;
    
    setIsRefreshing(true);
    try {
      await loadAttendees(eventId, staffId);
      toast.success('Attendee data refreshed');
    } finally {
      setIsRefreshing(false);
    }
  }, [eventId, staffId, loadAttendees]);

  // Search attendees
  const searchAttendees = useCallback(async (query: string, fields?: string[]) => {
    try {
      setSearchQuery(query);
      
      if (!query.trim()) {
        // If search is empty, reload all attendees with current filters
        await loadAttendees(eventId, staffId);
        return;
      }

      const results = await attendeeReportService.searchAttendees(
        eventId, 
        query, 
        fields, 
        staffId
      );

      setAttendees(results);
      
      // Recalculate analytics for search results
      if (analytics) {
        // You could implement a separate analytics calculation for search results
        // For now, we'll keep the original analytics
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [eventId, staffId, analytics, loadAttendees]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<AttendeeFilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Reload data with new filters
    if (eventId) {
      loadAttendees(eventId, staffId);
    }
  }, [filters, eventId, staffId, loadAttendees]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    
    if (eventId) {
      loadAttendees(eventId, staffId);
    }
  }, [eventId, staffId, loadAttendees]);

  // Selection management
  const selectAttendee = useCallback((attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId) ? prev : [...prev, attendeeId]
    );
  }, []);

  const deselectAttendee = useCallback((attendeeId: string) => {
    setSelectedAttendees(prev => prev.filter(id => id !== attendeeId));
  }, []);

  const selectAll = useCallback(() => {
    setSelectedAttendees(attendees.map(a => a.attendeeId));
  }, [attendees]);

  const deselectAll = useCallback(() => {
    setSelectedAttendees([]);
  }, []);

  const toggleAttendeeSelection = useCallback((attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId) 
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  }, []);

  // Get attendee details
  const getAttendeeDetails = useCallback(async (attendeeId: string): Promise<AttendeeReportInfo | null> => {
    try {
      return await attendeeReportService.getAttendeeDetails(
        eventId, 
        attendeeId, 
        staffId, 
        'Viewing detailed attendee information'
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get attendee details';
      toast.error(errorMessage);
      return null;
    }
  }, [eventId, staffId]);

  // Update attendee
  const updateAttendee = useCallback(async (
    attendeeId: string, 
    updates: Partial<AttendeeReportInfo>, 
    justification: string
  ): Promise<boolean> => {
    try {
      const result = await attendeeReportService.updateAttendee(
        eventId, 
        attendeeId, 
        updates, 
        staffId || 'unknown-staff', 
        justification
      );

      if (result.success) {
        toast.success('Attendee updated successfully');
        await refreshAttendees(); // Refresh to get updated data
        return true;
      } else {
        toast.error(result.error || 'Failed to update attendee');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update attendee';
      toast.error(errorMessage);
      return false;
    }
  }, [eventId, staffId, refreshAttendees]);

  // Perform bulk operations
  const performBulkOperation = useCallback(async (
    operation: Omit<BulkOperation, 'attendeeIds'>
  ): Promise<boolean> => {
    if (selectedAttendees.length === 0) {
      toast.error('No attendees selected');
      return false;
    }

    try {
      setIsPerformingBulkOperation(true);

      const fullOperation: BulkOperation = {
        ...operation,
        attendeeIds: selectedAttendees,
        staffId: staffId || 'unknown-staff'
      };

      const result = await attendeeReportService.performBulkOperation(eventId, fullOperation);

      if (result.success) {
        toast.success(`Bulk operation completed successfully on ${selectedAttendees.length} attendees`);
        setSelectedAttendees([]); // Clear selection
        await refreshAttendees(); // Refresh data
        return true;
      } else {
        toast.error(`Bulk operation completed with ${result.errors.length} errors`);
        if (result.errors.length > 0) {
          console.error('Bulk operation errors:', result.errors);
        }
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bulk operation failed';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsPerformingBulkOperation(false);
    }
  }, [selectedAttendees, eventId, staffId, refreshAttendees]);

  // Export attendees
  const exportAttendees = useCallback(async (
    config: Omit<ExportConfig, 'filterOptions'>, 
    justification: string
  ) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const fullConfig: ExportConfig = {
        ...config,
        filterOptions: filters
      };

      const result = await attendeeReportService.exportAttendeeData(
        eventId, 
        fullConfig, 
        staffId || 'unknown-staff', 
        justification
      );

      if (result.success && result.data && result.filename) {
        // Create and trigger download
        const blob = new Blob([result.data], { 
          type: config.format === 'csv' ? 'text/csv' : 'application/octet-stream' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(`Attendee data exported successfully as ${result.filename}`);
      } else {
        const errorMessage = result.error || 'Export failed';
        setExportError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      setExportError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, [eventId, staffId, filters]);

  // Get privacy audit log
  const getPrivacyAuditLog = useCallback(async (
    attendeeId?: string, 
    dateRange?: { start: Date; end: Date }
  ): Promise<PrivacyAuditRecord[]> => {
    try {
      return await attendeeReportService.getPrivacyAuditLog(
        attendeeId, 
        staffId, 
        dateRange
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get audit log';
      toast.error(errorMessage);
      return [];
    }
  }, [staffId]);

  // Utility functions
  const getFilteredAttendees = useCallback(() => attendees, [attendees]);
  
  const getAttendeeCount = useCallback(() => attendees.length, [attendees]);
  
  const getCheckedInCount = useCallback(() => 
    attendees.filter(a => a.isCheckedIn).length, [attendees]
  );
  
  const getVIPCount = useCallback(() => 
    attendees.filter(a => a.isVIP).length, [attendees]
  );

  // Auto-load data on mount or eventId change
  useEffect(() => {
    if (autoLoad && eventId && !isLoading) {
      loadAttendees(eventId, staffId);
    }
  }, [eventId, autoLoad, loadAttendees, staffId, isLoading]);

  // Listen to service events for real-time updates
  useEffect(() => {
    const handleServiceEvent = (event: any) => {
      switch (event.type) {
        case 'attendee_checkin_updated':
          if (event.data.eventId === eventId) {
            refreshAttendees();
          }
          break;
        case 'attendee_updated':
          if (event.data.eventId === eventId) {
            refreshAttendees();
          }
          break;
        case 'bulk_operation_completed':
          if (event.data.eventId === eventId) {
            toast.success(`Bulk ${event.data.operation} completed: ${event.data.successCount} success, ${event.data.errorCount} errors`);
          }
          break;
      }
    };

    attendeeReportService.addEventListener(handleServiceEvent);

    return () => {
      attendeeReportService.removeEventListener(handleServiceEvent);
    };
  }, [eventId, refreshAttendees]);

  return {
    // Data
    attendees,
    analytics,
    selectedAttendees,
    filteredCount: attendees.length,
    
    // Loading states
    isLoading,
    isExporting,
    isPerformingBulkOperation,
    isRefreshing,
    
    // Error states
    error,
    exportError,
    
    // Filters and search
    filters,
    searchQuery,
    
    // Actions
    loadAttendees,
    refreshAttendees,
    searchAttendees,
    updateFilters,
    clearFilters,
    
    // Selection management
    selectAttendee,
    deselectAttendee,
    selectAll,
    deselectAll,
    toggleAttendeeSelection,
    
    // Individual attendee operations
    getAttendeeDetails,
    updateAttendee,
    
    // Bulk operations
    performBulkOperation,
    
    // Export functionality
    exportAttendees,
    
    // Privacy and compliance
    getPrivacyAuditLog,
    
    // Utility functions
    getFilteredAttendees,
    getAttendeeCount,
    getCheckedInCount,
    getVIPCount
  };
}; 