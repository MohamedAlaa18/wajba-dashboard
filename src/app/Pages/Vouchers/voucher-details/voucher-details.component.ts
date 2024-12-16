import { Component, OnInit } from '@angular/core';
import { VouchersService } from '../../../Services/Vouchers/vouchers.service';
import { ActivatedRoute } from '@angular/router';
import { IVoucher } from '../../../Models/ipromo';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../Components/Shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-voucher-details',
  standalone: true,
  imports: [CommonModule,BreadcrumbComponent],
  templateUrl: './voucher-details.component.html',
  styleUrl: './voucher-details.component.scss'
})
export class VoucherDetailsComponent implements OnInit {
  voucherId!: number;
  voucher!: IVoucher;

  constructor(
    private activatedRoute: ActivatedRoute,
    private vouchersService: VouchersService
  ) {
    this.voucherId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.getVoucherDetails();
  }

  // Method to get offer details
  getVoucherDetails() {
    if (this.voucherId) {
      this.vouchersService.getCouponById(this.voucherId).subscribe(
        (response) => {
          this.voucher = response.data;
          console.log('voucher details:', this.voucher);
        },
        (error) => {
          console.error('Error fetching voucher details:', error);
        }
      );
    }
  }
}
