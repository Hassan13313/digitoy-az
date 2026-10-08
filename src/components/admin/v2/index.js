/**
 * Digitoy Admin — 1-ci hissə (yalnız görünüş komponentləri).
 * Ortaq komponentlər `adminUi.jsx`-dədir; 2-ci hissə də onları işlədir.
 */
export * from './adminUi';
export { default as AdminLoginGate } from './AdminLoginGate';
export { default as AdminDashboard } from './AdminDashboard';
export { default as OrdersList, ORDER_TABS } from './OrdersList';
export { default as OrderDetail, RejectDialog, ORDER_DETAIL_TABS } from './OrderDetail';
export { default as SeatingPlanTab, GuestFormDialog, MoveGuestDialog } from './SeatingPlanTab';
export { default as ImportDialog } from './ImportDialog';
export { default as GuestReportTab, ReportGroupCard, guestColumns } from './GuestReportTab';
export { default as RsvpTab } from './RsvpTab';

// ── 2-ci hissə ──
export { default as InvitationsList, TranslationPills } from './InvitationsList';
export { default as PurgeInvitationDialog } from './PurgeInvitationDialog';
export { default as ContentManager, CONTENT_TABS, diffCount } from './ContentManager';
export { default as TranslationDialog } from './TranslationDialog';
export { default as GalleriesList, AlbumCard } from './GalleriesList';
export { default as QrStandEditor, QR_LAYOUTS } from './QrStandEditor';
export { default as MessagesList, MessageCard } from './MessagesList';
export { default as MaintenancePage, HealthCard } from './MaintenancePage';
