import { CheckinRecord, AttendeeInfo, TicketInfo, checkinService } from './checkinService';
import { inventoryService } from './inventoryService';
import { emailCampaignService } from './emailCampaignService';
import { notificationService } from './notificationService';

// Extended attendee info for organizer reports
export interface AttendeeReportInfo extends AttendeeInfo {
  attendeeId: string;
  ticketInfo: TicketInfo;
  checkinRecord?: CheckinRecord;
  isCheckedIn: boolean;
  checkinTime?: Date;
  checkinMethod?: 'qr_scan' | 'manual' | 'self_service';
  staffId?: string;
  notes?: string;
  isVIP: boolean;
  specialRequests?: string[];
  tags?: string[];
  purchaseId: string;
  purchaseDate: Date;
  refundStatus?: 'none' | 'requested' | 'approved' | 'completed';
  groupSize?: number;
  isGroupLeader?: boolean;
  totalSpent: number;
  discountsApplied?: string[];
  lastActivity: Date;
  communicationHistory: CommunicationRecord[];
  privacyConsent: boolean;
  dataRetentionExpiry?: Date;
}

// Communication history
export interface CommunicationRecord {
  id: string;
  type: 'email' | 'sms' | 'notification' | 'call';
  subject?: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
  staffId?: string;
}

// Advanced filtering options
export interface AttendeeFilterOptions {
  search?: string;
  checkinStatus?: 'all' | 'checked_in' | 'not_checked_in';
  ticketTypes?: string[];
  isVIP?: boolean;
  purchaseDateRange?: { start: Date; end: Date };
  refundStatus?: 'none' | 'requested' | 'approved' | 'completed';
  hasSpecialRequests?: boolean;
  tags?: string[];
  totalSpentRange?: { min: number; max: number };
  communicationStatus?: 'contacted' | 'not_contacted' | 'bounced';
  lastActivityRange?: { start: Date; end: Date };
}

// Bulk operations
export interface BulkOperation {
  type: 'checkin' | 'export' | 'email' | 'sms' | 'tag' | 'note' | 'vip_status' | 'privacy_update';
  attendeeIds: string[];
  data?: any;
  staffId: string;
  reason?: string;
}

// Analytics data
export interface AttendeeAnalytics {
  totalAttendees: number;
  checkedInCount: number;
  checkinRate: number;
  vipCount: number;
  refundRequests: number;
  averageTicketValue: number;
  registrationTimeline: { date: Date; count: number }[];
  ticketTypeDistribution: { type: string; count: number; percentage: number }[];
  geographicBreakdown: { location: string; count: number; percentage: number }[];
  communicationStats: { type: string; sent: number; opened: number; clicked: number }[];
  attendeeLifecycle: { stage: string; count: number }[];
  specialRequestsCount: number;
  groupBookingsCount: number;
}

// Export configuration
export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf';
  fields: string[];
  includePersonalData: boolean;
  includeCommunicationHistory: boolean;
  filterOptions?: AttendeeFilterOptions;
  customFields?: { [key: string]: string };
}

// Privacy audit log
export interface PrivacyAuditRecord {
  id: string;
  attendeeId: string;
  action: 'view' | 'export' | 'update' | 'delete' | 'communication';
  staffId: string;
  timestamp: Date;
  details: string;
  ipAddress?: string;
  justification?: string;
}

class AttendeeReportService {
  private attendeeCache = new Map<string, AttendeeReportInfo[]>();
  private analyticsCache = new Map<string, AttendeeAnalytics>();
  private privacyAuditLog: PrivacyAuditRecord[] = [];
  private eventListeners: ((data: any) => void)[] = [];

  constructor() {
    // Listen to checkin service updates
    checkinService.addEventListener((event) => {
      this.handleCheckinUpdate(event);
    });

    // Listen to inventory updates for purchase tracking
    inventoryService.addEventListener((event) => {
      this.handleInventoryUpdate(event);
    });
  }

  // Event listener management
  addEventListener(callback: (data: any) => void) {
    this.eventListeners.push(callback);
  }

  removeEventListener(callback: (data: any) => void) {
    const index = this.eventListeners.indexOf(callback);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private notifyListeners(eventType: string, data: any) {
    this.eventListeners.forEach(callback => {
      callback({ type: eventType, data });
    });
  }

  // Get attendees with comprehensive filtering and privacy controls
  async getAttendees(
    eventId: string, 
    filters?: AttendeeFilterOptions,
    staffId?: string,
    justification?: string
  ): Promise<{ attendees: AttendeeReportInfo[]; analytics: AttendeeAnalytics }> {
    try {
      // Log privacy access
      if (staffId) {
        await this.logPrivacyAccess('view', 'bulk', staffId, 'Viewing attendee list', justification);
      }

      // Check cache first
      let attendees = this.attendeeCache.get(eventId);
      let analytics = this.analyticsCache.get(eventId);

      // Generate mock data if not cached (in real app, fetch from API)
      if (!attendees) {
        attendees = this.generateMockAttendees(eventId);
        analytics = this.calculateAnalytics(attendees);
        
        // Cache the data
        this.attendeeCache.set(eventId, attendees);
        this.analyticsCache.set(eventId, analytics);
      }

      // Apply filters
      const filteredAttendees = this.applyFilters(attendees, filters);
      
      // Recalculate analytics for filtered data
      const filteredAnalytics = this.calculateAnalytics(filteredAttendees);

      return { attendees: filteredAttendees, analytics: filteredAnalytics };
    } catch (error) {
      console.error('Error getting attendees:', error);
      throw error;
    }
  }

  // Get single attendee details with privacy logging
  async getAttendeeDetails(
    eventId: string, 
    attendeeId: string,
    staffId?: string,
    justification?: string
  ): Promise<AttendeeReportInfo | null> {
    try {
      // Log privacy access
      if (staffId) {
        await this.logPrivacyAccess('view', attendeeId, staffId, 'Viewing attendee details', justification);
      }

      const { attendees } = await this.getAttendees(eventId);
      return attendees.find(a => a.attendeeId === attendeeId) || null;
    } catch (error) {
      console.error('Error getting attendee details:', error);
      return null;
    }
  }

  // Search attendees with advanced criteria
  async searchAttendees(
    eventId: string, 
    query: string,
    searchFields?: string[],
    staffId?: string
  ): Promise<AttendeeReportInfo[]> {
    try {
      // Log search access
      if (staffId) {
        await this.logPrivacyAccess('view', 'search', staffId, `Searching attendees: "${query}"`);
      }

      const { attendees } = await this.getAttendees(eventId);
      const searchTerm = query.toLowerCase().trim();

      if (!searchTerm) return attendees;

      const fieldsToSearch = searchFields || ['firstName', 'lastName', 'email', 'phone', 'ticketId'];

      return attendees.filter(attendee => {
        return fieldsToSearch.some(field => {
          switch (field) {
            case 'firstName':
              return attendee.firstName.toLowerCase().includes(searchTerm);
            case 'lastName':
              return attendee.lastName.toLowerCase().includes(searchTerm);
            case 'email':
              return attendee.email.toLowerCase().includes(searchTerm);
            case 'phone':
              return attendee.phone?.includes(searchTerm) || false;
            case 'ticketId':
              return attendee.ticketInfo.ticketId.toLowerCase().includes(searchTerm);
            case 'ticketType':
              return attendee.ticketInfo.ticketType.toLowerCase().includes(searchTerm);
            case 'tags':
              return attendee.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false;
            default:
              return false;
          }
        });
      });
    } catch (error) {
      console.error('Error searching attendees:', error);
      return [];
    }
  }

  // Export attendee data with privacy controls
  async exportAttendeeData(
    eventId: string,
    config: ExportConfig,
    staffId: string,
    justification: string
  ): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    try {
      // Log export access
      await this.logPrivacyAccess('export', 'bulk', staffId, `Exporting attendee data (${config.format})`, justification);

      const { attendees } = await this.getAttendees(eventId, config.filterOptions, staffId, justification);

      switch (config.format) {
        case 'csv':
          return this.exportAsCSV(attendees, config);
        case 'excel':
          return this.exportAsExcel(attendees, config);
        case 'pdf':
          return this.exportAsPDF(attendees, config);
        default:
          throw new Error(`Unsupported format: ${config.format}`);
      }
    } catch (error) {
      console.error('Error exporting attendee data:', error);
      return { success: false, error: error.message };
    }
  }

  // Perform bulk operations on attendees
  async performBulkOperation(
    eventId: string, 
    operation: BulkOperation
  ): Promise<{ success: boolean; results: any[]; errors: string[] }> {
    try {
      // Log bulk operation
      await this.logPrivacyAccess(
        operation.type as any, 
        'bulk', 
        operation.staffId, 
        `Bulk operation: ${operation.type} on ${operation.attendeeIds.length} attendees`,
        operation.reason
      );

      const results: any[] = [];
      const errors: string[] = [];

      for (const attendeeId of operation.attendeeIds) {
        try {
          let result;
          switch (operation.type) {
            case 'email':
              result = await this.sendEmail(eventId, attendeeId, operation.data);
              break;
            case 'sms':
              result = await this.sendSMS(eventId, attendeeId, operation.data);
              break;
            case 'tag':
              result = await this.addTags(eventId, attendeeId, operation.data.tags);
              break;
            case 'note':
              result = await this.addNote(eventId, attendeeId, operation.data.note, operation.staffId);
              break;
            case 'vip_status':
              result = await this.updateVIPStatus(eventId, attendeeId, operation.data.isVIP);
              break;
            case 'privacy_update':
              result = await this.updatePrivacyConsent(eventId, attendeeId, operation.data.consent);
              break;
            default:
              throw new Error(`Unsupported operation: ${operation.type}`);
          }
          results.push({ attendeeId, success: true, result });
        } catch (error) {
          errors.push(`${attendeeId}: ${error.message}`);
          results.push({ attendeeId, success: false, error: error.message });
        }
      }

      // Notify listeners of bulk operation completion
      this.notifyListeners('bulk_operation_completed', {
        eventId,
        operation: operation.type,
        attendeeCount: operation.attendeeIds.length,
        successCount: results.filter(r => r.success).length,
        errorCount: errors.length
      });

      return { success: errors.length === 0, results, errors };
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      return { success: false, results: [], errors: [error.message] };
    }
  }

  // Update attendee information
  async updateAttendee(
    eventId: string,
    attendeeId: string,
    updates: Partial<AttendeeReportInfo>,
    staffId: string,
    justification: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Log update access
      await this.logPrivacyAccess('update', attendeeId, staffId, 'Updating attendee information', justification);

      const attendees = this.attendeeCache.get(eventId);
      if (!attendees) {
        throw new Error('Attendees not found');
      }

      const attendeeIndex = attendees.findIndex(a => a.attendeeId === attendeeId);
      if (attendeeIndex === -1) {
        throw new Error('Attendee not found');
      }

      // Update attendee
      attendees[attendeeIndex] = { ...attendees[attendeeIndex], ...updates, lastActivity: new Date() };

      // Update cache
      this.attendeeCache.set(eventId, attendees);

      // Recalculate analytics
      const analytics = this.calculateAnalytics(attendees);
      this.analyticsCache.set(eventId, analytics);

      // Notify listeners
      this.notifyListeners('attendee_updated', {
        eventId,
        attendeeId,
        updates
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating attendee:', error);
      return { success: false, error: error.message };
    }
  }

  // Get privacy audit log
  async getPrivacyAuditLog(
    attendeeId?: string,
    staffId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<PrivacyAuditRecord[]> {
    let filteredLog = [...this.privacyAuditLog];

    if (attendeeId) {
      filteredLog = filteredLog.filter(record => record.attendeeId === attendeeId);
    }

    if (staffId) {
      filteredLog = filteredLog.filter(record => record.staffId === staffId);
    }

    if (dateRange) {
      filteredLog = filteredLog.filter(record => 
        record.timestamp >= dateRange.start && record.timestamp <= dateRange.end
      );
    }

    return filteredLog.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Private helper methods
  private async logPrivacyAccess(
    action: 'view' | 'export' | 'update' | 'delete' | 'communication',
    attendeeId: string,
    staffId: string,
    details: string,
    justification?: string
  ): Promise<void> {
    const record: PrivacyAuditRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attendeeId,
      action,
      staffId,
      timestamp: new Date(),
      details,
      justification
    };

    this.privacyAuditLog.push(record);

    // In production, this would be sent to a secure audit service
    console.log('Privacy audit log:', record);
  }

  private applyFilters(
    attendees: AttendeeReportInfo[], 
    filters?: AttendeeFilterOptions
  ): AttendeeReportInfo[] {
    if (!filters) return attendees;

    return attendees.filter(attendee => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchMatch = (
          attendee.firstName.toLowerCase().includes(searchTerm) ||
          attendee.lastName.toLowerCase().includes(searchTerm) ||
          attendee.email.toLowerCase().includes(searchTerm) ||
          (attendee.phone && attendee.phone.includes(searchTerm)) ||
          attendee.ticketInfo.ticketId.toLowerCase().includes(searchTerm)
        );
        if (!searchMatch) return false;
      }

      // Check-in status filter
      if (filters.checkinStatus && filters.checkinStatus !== 'all') {
        const isCheckedIn = attendee.isCheckedIn;
        if (filters.checkinStatus === 'checked_in' && !isCheckedIn) return false;
        if (filters.checkinStatus === 'not_checked_in' && isCheckedIn) return false;
      }

      // Ticket type filter
      if (filters.ticketTypes && filters.ticketTypes.length > 0) {
        if (!filters.ticketTypes.includes(attendee.ticketInfo.ticketType)) return false;
      }

      // VIP filter
      if (filters.isVIP !== undefined) {
        if (attendee.isVIP !== filters.isVIP) return false;
      }

      // Purchase date range filter
      if (filters.purchaseDateRange) {
        const purchaseDate = new Date(attendee.purchaseDate);
        if (purchaseDate < filters.purchaseDateRange.start || 
            purchaseDate > filters.purchaseDateRange.end) return false;
      }

      // Refund status filter
      if (filters.refundStatus) {
        if (attendee.refundStatus !== filters.refundStatus) return false;
      }

      // Special requests filter
      if (filters.hasSpecialRequests !== undefined) {
        const hasRequests = attendee.specialRequests && attendee.specialRequests.length > 0;
        if (hasRequests !== filters.hasSpecialRequests) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!attendee.tags || !filters.tags.some(tag => attendee.tags!.includes(tag))) return false;
      }

      // Total spent range filter
      if (filters.totalSpentRange) {
        if (attendee.totalSpent < filters.totalSpentRange.min || 
            attendee.totalSpent > filters.totalSpentRange.max) return false;
      }

      // Communication status filter
      if (filters.communicationStatus) {
        const hasContactHistory = attendee.communicationHistory.length > 0;
        const hasBounced = attendee.communicationHistory.some(c => c.status === 'failed');
        
        if (filters.communicationStatus === 'contacted' && !hasContactHistory) return false;
        if (filters.communicationStatus === 'not_contacted' && hasContactHistory) return false;
        if (filters.communicationStatus === 'bounced' && !hasBounced) return false;
      }

      // Last activity range filter
      if (filters.lastActivityRange) {
        const lastActivity = new Date(attendee.lastActivity);
        if (lastActivity < filters.lastActivityRange.start || 
            lastActivity > filters.lastActivityRange.end) return false;
      }

      return true;
    });
  }

  private calculateAnalytics(attendees: AttendeeReportInfo[]): AttendeeAnalytics {
    const totalAttendees = attendees.length;
    const checkedInCount = attendees.filter(a => a.isCheckedIn).length;
    const vipCount = attendees.filter(a => a.isVIP).length;
    const refundRequests = attendees.filter(a => a.refundStatus && a.refundStatus !== 'none').length;
    const totalRevenue = attendees.reduce((sum, a) => sum + a.totalSpent, 0);
    const specialRequestsCount = attendees.filter(a => a.specialRequests && a.specialRequests.length > 0).length;
    const groupBookingsCount = attendees.filter(a => a.isGroupLeader).length;

    // Registration timeline (last 30 days)
    const registrationTimeline: { date: Date; count: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const count = attendees.filter(a => {
        const purchaseDate = new Date(a.purchaseDate);
        return purchaseDate.toDateString() === date.toDateString();
      }).length;
      registrationTimeline.push({ date, count });
    }

    // Ticket type distribution
    const ticketTypeCounts = new Map<string, number>();
    attendees.forEach(a => {
      const count = ticketTypeCounts.get(a.ticketInfo.ticketType) || 0;
      ticketTypeCounts.set(a.ticketInfo.ticketType, count + 1);
    });

    const ticketTypeDistribution = Array.from(ticketTypeCounts.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalAttendees) * 100)
    }));

    // Geographic breakdown (mock data)
    const geographicBreakdown = [
      { location: 'Chicago, IL', count: Math.floor(totalAttendees * 0.4), percentage: 40 },
      { location: 'Milwaukee, WI', count: Math.floor(totalAttendees * 0.2), percentage: 20 },
      { location: 'Detroit, MI', count: Math.floor(totalAttendees * 0.15), percentage: 15 },
      { location: 'Indianapolis, IN', count: Math.floor(totalAttendees * 0.1), percentage: 10 },
      { location: 'Other', count: Math.floor(totalAttendees * 0.15), percentage: 15 }
    ];

    // Communication stats
    const allCommunications = attendees.flatMap(a => a.communicationHistory);
    const communicationStats = [
      {
        type: 'Email',
        sent: allCommunications.filter(c => c.type === 'email').length,
        opened: allCommunications.filter(c => c.type === 'email' && c.status === 'opened').length,
        clicked: allCommunications.filter(c => c.type === 'email' && c.status === 'clicked').length
      },
      {
        type: 'SMS',
        sent: allCommunications.filter(c => c.type === 'sms').length,
        opened: allCommunications.filter(c => c.type === 'sms' && c.status === 'delivered').length,
        clicked: 0
      }
    ];

    // Attendee lifecycle
    const attendeeLifecycle = [
      { stage: 'Registered', count: totalAttendees },
      { stage: 'Contacted', count: attendees.filter(a => a.communicationHistory.length > 0).length },
      { stage: 'Checked In', count: checkedInCount },
      { stage: 'VIP', count: vipCount }
    ];

    return {
      totalAttendees,
      checkedInCount,
      checkinRate: totalAttendees > 0 ? Math.round((checkedInCount / totalAttendees) * 100) : 0,
      vipCount,
      refundRequests,
      averageTicketValue: totalAttendees > 0 ? Math.round(totalRevenue / totalAttendees) : 0,
      registrationTimeline,
      ticketTypeDistribution,
      geographicBreakdown,
      communicationStats,
      attendeeLifecycle,
      specialRequestsCount,
      groupBookingsCount
    };
  }

  private generateMockAttendees(eventId: string): AttendeeReportInfo[] {
    const ticketTypes = ['General Admission', 'VIP', 'Early Bird', 'Student', 'Group'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Amanda', 'Robert', 'Lisa'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

    const attendees: AttendeeReportInfo[] = [];
    const attendeeCount = Math.floor(Math.random() * 200) + 50; // 50-250 attendees

    for (let i = 0; i < attendeeCount; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
      const ticketType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
      const isVIP = ticketType === 'VIP' || Math.random() < 0.1;
      const isCheckedIn = Math.random() < 0.75;
      const purchaseDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Last 30 days
      
      const attendee: AttendeeReportInfo = {
        attendeeId: `attendee-${i + 1}`,
        firstName,
        lastName,
        email,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        ticketInfo: {
          ticketId: `TICKET-${eventId}-${String(i + 1).padStart(4, '0')}`,
          ticketType,
          price: ticketType === 'VIP' ? 150 : ticketType === 'Student' ? 25 : 75,
          qrCode: `data:image/svg+xml;base64,${btoa(`<svg></svg>`)}`
        },
        isCheckedIn,
        checkinTime: isCheckedIn ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        checkinMethod: isCheckedIn ? ['qr_scan', 'manual', 'self_service'][Math.floor(Math.random() * 3)] as any : undefined,
        notes: Math.random() < 0.2 ? 'Special dietary requirements' : undefined,
        isVIP,
        specialRequests: Math.random() < 0.3 ? ['Wheelchair accessible', 'Dietary restrictions'] : undefined,
        tags: Math.random() < 0.4 ? ['first-time', 'frequent-attendee', 'local'].slice(0, Math.floor(Math.random() * 3) + 1) : undefined,
        purchaseId: `PURCHASE-${Date.now()}-${i}`,
        purchaseDate,
        refundStatus: Math.random() < 0.05 ? 'requested' : 'none',
        groupSize: Math.random() < 0.3 ? Math.floor(Math.random() * 8) + 2 : 1,
        isGroupLeader: Math.random() < 0.1,
        totalSpent: ticketType === 'VIP' ? 150 : ticketType === 'Student' ? 25 : 75,
        discountsApplied: Math.random() < 0.2 ? ['EARLY_BIRD'] : undefined,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        communicationHistory: this.generateMockCommunicationHistory(),
        privacyConsent: true,
        dataRetentionExpiry: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 years
      };

      attendees.push(attendee);
    }

    return attendees;
  }

  private generateMockCommunicationHistory(): CommunicationRecord[] {
    const history: CommunicationRecord[] = [];
    const communicationCount = Math.floor(Math.random() * 5);

    for (let i = 0; i < communicationCount; i++) {
      const type = ['email', 'sms', 'notification'][Math.floor(Math.random() * 3)] as any;
      const sentAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      history.push({
        id: `comm-${Date.now()}-${i}`,
        type,
        subject: type === 'email' ? 'Event Reminder' : undefined,
        sentAt,
        status: ['sent', 'delivered', 'opened', 'clicked'][Math.floor(Math.random() * 4)] as any,
        staffId: 'staff-123'
      });
    }

    return history;
  }

  private async exportAsCSV(attendees: AttendeeReportInfo[], config: ExportConfig): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    try {
      const headers = this.getExportHeaders(config);
      const rows = attendees.map(attendee => this.formatAttendeeForExport(attendee, config));

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const filename = `attendees-${new Date().toISOString().split('T')[0]}.csv`;

      return {
        success: true,
        data: csvContent,
        filename
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async exportAsExcel(attendees: AttendeeReportInfo[], config: ExportConfig): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    // In a real implementation, this would use a library like xlsx
    // For now, return CSV format
    return this.exportAsCSV(attendees, config);
  }

  private async exportAsPDF(attendees: AttendeeReportInfo[], config: ExportConfig): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    // In a real implementation, this would use a library like jsPDF
    // For now, return CSV format
    return this.exportAsCSV(attendees, config);
  }

  private getExportHeaders(config: ExportConfig): string[] {
    const defaultHeaders = ['Name', 'Email', 'Ticket Type', 'Purchase Date', 'Check-in Status'];
    
    if (config.fields.length > 0) {
      return config.fields;
    }
    
    return defaultHeaders;
  }

  private formatAttendeeForExport(attendee: AttendeeReportInfo, config: ExportConfig): string[] {
    const row = [
      `"${attendee.firstName} ${attendee.lastName}"`,
      attendee.email,
      attendee.ticketInfo.ticketType,
      attendee.purchaseDate.toLocaleDateString(),
      attendee.isCheckedIn ? 'Checked In' : 'Not Checked In'
    ];

    if (config.includePersonalData) {
      row.push(attendee.phone || '');
    }

    return row;
  }

  // Communication helper methods
  private async sendEmail(eventId: string, attendeeId: string, emailData: any): Promise<boolean> {
    // Integration with email campaign service
    return true; // Mock success
  }

  private async sendSMS(eventId: string, attendeeId: string, smsData: any): Promise<boolean> {
    // Integration with SMS service
    return true; // Mock success
  }

  private async addTags(eventId: string, attendeeId: string, tags: string[]): Promise<boolean> {
    const attendees = this.attendeeCache.get(eventId);
    if (!attendees) return false;

    const attendee = attendees.find(a => a.attendeeId === attendeeId);
    if (!attendee) return false;

    attendee.tags = [...(attendee.tags || []), ...tags];
    attendee.lastActivity = new Date();

    return true;
  }

  private async addNote(eventId: string, attendeeId: string, note: string, staffId: string): Promise<boolean> {
    const attendees = this.attendeeCache.get(eventId);
    if (!attendees) return false;

    const attendee = attendees.find(a => a.attendeeId === attendeeId);
    if (!attendee) return false;

    attendee.notes = note;
    attendee.lastActivity = new Date();

    return true;
  }

  private async updateVIPStatus(eventId: string, attendeeId: string, isVIP: boolean): Promise<boolean> {
    const attendees = this.attendeeCache.get(eventId);
    if (!attendees) return false;

    const attendee = attendees.find(a => a.attendeeId === attendeeId);
    if (!attendee) return false;

    attendee.isVIP = isVIP;
    attendee.lastActivity = new Date();

    return true;
  }

  private async updatePrivacyConsent(eventId: string, attendeeId: string, consent: boolean): Promise<boolean> {
    const attendees = this.attendeeCache.get(eventId);
    if (!attendees) return false;

    const attendee = attendees.find(a => a.attendeeId === attendeeId);
    if (!attendee) return false;

    attendee.privacyConsent = consent;
    attendee.lastActivity = new Date();

    return true;
  }

  // Real-time update handlers
  private handleCheckinUpdate(event: any) {
    if (event.type === 'attendee_checked_in') {
      const { eventId, attendeeId, checkinTime, method } = event.data;
      const attendees = this.attendeeCache.get(eventId);
      
      if (attendees) {
        const attendee = attendees.find(a => a.attendeeId === attendeeId);
        if (attendee) {
          attendee.isCheckedIn = true;
          attendee.checkinTime = new Date(checkinTime);
          attendee.checkinMethod = method;
          attendee.lastActivity = new Date();

          // Recalculate analytics
          const analytics = this.calculateAnalytics(attendees);
          this.analyticsCache.set(eventId, analytics);

          // Notify listeners
          this.notifyListeners('attendee_checkin_updated', { eventId, attendeeId });
        }
      }
    }
  }

  private handleInventoryUpdate(event: any) {
    // Handle inventory/purchase updates if needed
    if (event.type === 'ticket_purchased') {
      const { eventId } = event.data;
      // Invalidate cache to force refresh
      this.attendeeCache.delete(eventId);
      this.analyticsCache.delete(eventId);
    }
  }
}

export const attendeeReportService = new AttendeeReportService(); 