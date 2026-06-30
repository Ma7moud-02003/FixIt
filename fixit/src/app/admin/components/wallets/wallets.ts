import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { WalletService } from '../../services/wallet-service';
import { Subscription } from 'rxjs';
import { WithdrawRequest } from '../../Model/withdrawRequest';
import { Transaction } from '../../Model/transactions';
import { Deposit } from '../../Model/deposit';
import { CommonModule } from '@angular/common';

type StatusBadgeKey = 'approved' | 'rejected' | 'pending' | 'initiated' | 'wallet';
 
const STATUS_BADGE_CLASSES: Record<StatusBadgeKey, string> = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  initiated: 'bg-blue-100 text-blue-700',
  wallet: 'bg-gray-100 text-gray-700',
};
 
const FALLBACK_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <rect width="40" height="40" rx="20" fill="#e5e7eb"/>
      <circle cx="20" cy="16" r="7" fill="#9ca3af"/>
      <path d="M6 36c0-8 6.3-13 14-13s14 5 14 13" fill="#9ca3af"/>
    </svg>`
  );
@Component({
  selector: 'app-wallets',
  imports: [CommonModule],
  templateUrl: './wallets.html',
  styleUrl: './wallets.css',
})
export class Wallets implements OnInit{
  fallbackAvatar = FALLBACK_AVATAR;
 
   pageSize = signal(10);
 
  // ---------- Withdraw Requests state ----------
   withdrawRequests = signal<WithdrawRequest[]>([]);
   withdrawLoading = signal(false);
   withdrawError = signal<string | null>(null);
   withdrawPage = signal(1);
   withdrawTotalPages = signal(1);
   withdrawHasNextPage = signal(false);
   withdrawHasPreviousPage = signal(false);
 
   withdrawIsEmpty = computed(
    () =>
      !this.withdrawLoading() &&
      !this.withdrawError() &&
      this.withdrawRequests().length === 0
  );
 
  // ---------- Deposits state ----------
   deposits = signal<Deposit[]>([]);
   depositLoading = signal(false);
   depositError = signal<string | null>(null);
   depositPage = signal(1);
   depositTotalPages = signal(1);
   depositHasNextPage = signal(false);
   depositHasPreviousPage = signal(false);
 
   depositIsEmpty = computed(
    () =>
      !this.depositLoading() &&
      !this.depositError() &&
      this.deposits().length === 0
  );
 
  // ---------- Transactions state ----------
   transactions = signal<Transaction[]>([]);
   transactionLoading = signal(false);
   transactionError = signal<string | null>(null);
   transactionPage = signal(1);
   transactionTotalPages = signal(1);
   transactionHasNextPage = signal(false);
   transactionHasPreviousPage = signal(false);
 
   transactionIsEmpty = computed(
    () =>
      !this.transactionLoading() &&
      !this.transactionError() &&
      this.transactions().length === 0
  );
 
  constructor(private  walletService: WalletService) {}
 
  ngOnInit(): void {
    this.loadWithdrawRequests();
    this.loadDeposits();
    this.loadTransactions();
  }
 
  // ---------- Loaders ----------
  loadWithdrawRequests(): void {
    this.withdrawLoading.set(true);
    this.withdrawError.set(null);
 
    this.walletService
      .getAllWithdrawRequests(this.withdrawPage(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.withdrawRequests.set(response.data);
          this.withdrawTotalPages.set(response.totalPages);
          this.withdrawHasNextPage.set(response.hasNextPage);
          this.withdrawHasPreviousPage.set(response.hasPreviousPage);
          this.withdrawLoading.set(false);
        },
        error: () => {
          this.withdrawError.set('Failed to load withdraw requests.');
          this.withdrawLoading.set(false);
        },
      });
  }
 
  loadDeposits(): void {
    this.depositLoading.set(true);
    this.depositError.set(null);
 
    this.walletService
      .getAllDeposits(this.depositPage(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.deposits.set(response.data);
          this.depositTotalPages.set(response.totalPages);
          this.depositHasNextPage.set(response.hasNextPage);
          this.depositHasPreviousPage.set(response.hasPreviousPage);
          this.depositLoading.set(false);
        },
        error: () => {
          this.depositError.set('Failed to load deposits.');
          this.depositLoading.set(false);
        },
      });
  }
 
  loadTransactions(): void {
    this.transactionLoading.set(true);
    this.transactionError.set(null);
 
    this.walletService
      .getAllTransactions(this.transactionPage(), this.pageSize())
      .subscribe({
        next: (response) => {
          this.transactions.set(response.data);
          this.transactionTotalPages.set(response.totalPages);
          this.transactionHasNextPage.set(response.hasNextPage);
          this.transactionHasPreviousPage.set(response.hasPreviousPage);
          this.transactionLoading.set(false);
        },
        error: () => {
          this.transactionError.set('Failed to load transactions.');
          this.transactionLoading.set(false);
        },
      });
  }
 
  // ---------- Pagination: Withdraw Requests ----------
  nextWithdrawPage(): void {
    if (!this.withdrawHasNextPage()) {
      return;
    }
    this.withdrawPage.update((page) => page + 1);
    this.loadWithdrawRequests();
  }
 
  previousWithdrawPage(): void {
    if (!this.withdrawHasPreviousPage()) {
      return;
    }
    this.withdrawPage.update((page) => page - 1);
    this.loadWithdrawRequests();
  }
 
  // ---------- Pagination: Deposits ----------
  nextDepositPage(): void {
    if (!this.depositHasNextPage()) {
      return;
    }
    this.depositPage.update((page) => page + 1);
    this.loadDeposits();
  }
 
  previousDepositPage(): void {
    if (!this.depositHasPreviousPage()) {
      return;
    }
    this.depositPage.update((page) => page - 1);
    this.loadDeposits();
  }
 
  // ---------- Pagination: Transactions ----------
  nextTransactionPage(): void {
    if (!this.transactionHasNextPage()) {
      return;
    }
    this.transactionPage.update((page) => page + 1);
    this.loadTransactions();
  }
 
  previousTransactionPage(): void {
    if (!this.transactionHasPreviousPage()) {
      return;
    }
    this.transactionPage.update((page) => page - 1);
    this.loadTransactions();
  }
 
  // ---------- Helpers ----------
  getStatusBadgeClass(status: string): string {
    const key = (status ?? '').toLowerCase() as StatusBadgeKey;
    return STATUS_BADGE_CLASSES[key] ?? 'bg-gray-100 text-gray-700';
  }
 
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.fallbackAvatar;
  }
 
  trackByWithdrawId(_index: number, item: WithdrawRequest): string {
    return item.id;
  }
 
  trackByDepositId(_index: number, item: Deposit): string {
    return item.paymentId;
  }
 
  trackByTransactionId(_index: number, item: Transaction): string {
    return item.transactionId;
  }
 
  range(length: number): number[] {
    return Array.from({ length }, (_, index) => index);
  }
}
