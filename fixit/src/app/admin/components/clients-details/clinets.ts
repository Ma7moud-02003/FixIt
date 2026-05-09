
import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, OnDestroy, OnInit, Output, output, signal } from '@angular/core';
import { UserRole } from '../../../Shared/enums/role';
import { IClient } from '../clinets/clinets';
export type UserRolee = UserRole;
export type UserStatus = true|false;
interface ArraySection {
  key: keyof IClient;
  label: string;
  icon: string;
}
@Component({
  selector: 'app-clinet-details',
  imports: [CommonModule],
  templateUrl: './clinets.html',
  styleUrl: './clinets.css',
})
export class ClinetDetails { // ── Inputs ──────────────────────────────────────────────────────
  user = input.required<IClient>();
  @Output() cancle=new EventEmitter<void>();
  skip()
  {
    this.cancle.emit()
  }
  // ── Output: يبعت للـ parent إنه يقفل ──────────────────────────
  closePanel = output<void>();
 
  // ── Sections state ──────────────────────────────────────────────
  collapsedSections = signal<Set<string>>(new Set());
 
  // ── Computed values ─────────────────────────────────────────────
  formattedCreatedAt = computed(() => {
    const raw = this.user().createdAt;
    if (!raw) return 'No data';
    return new Date(raw).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  });
 
  formattedLastLogin = computed(() => {
    const raw = this.user().lastLogin;
    if (!raw) return 'No data';
    return new Date(raw).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  });
 
  roleBadgeClass = computed(() => {
    const role = this.user().role?.toLowerCase();
    const map: Record<string, string> = {
      admin:  'bg-violet-100 text-violet-700 ring-violet-200',
      client: 'bg-sky-100    text-sky-700    ring-sky-200',
      worker: 'bg-amber-100  text-amber-700  ring-amber-200',
    };
    return map[role] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  });
 
  avatarSrc = computed(() =>
    this.user().imgUrl ||
    'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.user().fullName)
  );
 
  arraySections: ArraySection[] = [
    { key: 'clientChatRooms', label: 'Client Chat Rooms', icon: '💬' },
    { key: 'favorites',       label: 'Favorites',         icon: '⭐' },
    { key: 'messages',        label: 'Messages',          icon: '✉️' },
    { key: 'notifications',   label: 'Notifications',     icon: '🔔' },
    { key: 'reviews',         label: 'Reviews',           icon: '📝' },
    { key: 'sentRequests',    label: 'Sent Requests',     icon: '📤' },
    { key: 'receivedReports', label: 'Received Reports',  icon: '📥' },
    { key: 'workerChatRooms', label: 'Worker Chat Rooms', icon: '🛠️' },
  ];
 
  // ── Methods ─────────────────────────────────────────────────────
 
  /** يبعت event للـ parent عشان يقفل الـ @if */
  onClose() {
    this.closePanel.emit();
  }
 
  toggleSection(key: string) {
    this.collapsedSections.update(set => {
      const next = new Set(set);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }
 
  isSectionCollapsed(key: string): boolean {
    return this.collapsedSections().has(key);
  }
 
  getArray(key: keyof IClient): any[] {
    const val = this.user()[key];
    return Array.isArray(val) ? val : [];
  }
 
  trackByIndex(index: number): number {
    return index;
  }
  
}
