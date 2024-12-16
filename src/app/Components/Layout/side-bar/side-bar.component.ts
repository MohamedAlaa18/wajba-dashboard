import { Component, OnInit } from '@angular/core';
import { IconComponent } from "../../Shared/icon/icon.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../Services/Sidebar/sidebar.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [IconComponent, CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']  // Fixed typo here: should be "styleUrls"
})
export class SideBarComponent implements OnInit {
  isSidebarOpen = false;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) { }

  // List of menu items with headers
  menuItems = [
    { type: 'link', name: 'Dashboard', iconName: 'dashboard', path: '/dashboard' },
    { type: 'link', name: 'Items', iconName: 'items', path: '/items' },
    { type: 'link', name: 'Popular today', iconName: 'popular', path: '/popular' },
    { type: 'link', name: 'Dining Tables', iconName: 'tables', path: '/tables' },
    { type: 'header', name: 'POS Orders' },
    { type: 'link', name: 'Pos', iconName: 'pos', path: '/pos' },
    { type: 'link', name: 'Pos Orders', iconName: 'items', path: '/posOrders' },
    // { type: 'link', name: 'Table Orders', iconName: 'tables', path: '/tableOrders' },
    // { type: 'link', name: 'Delivery Orders', iconName: 'delivery', path: '/deliveryOrders' },
    // { type: 'link', name: 'Pick Up Orders', iconName: 'pickup', path: '/pickupOrders' },
    // { type: 'link', name: 'Dine In Orders', iconName: 'dineIn', path: '/dineInOrders' },
    // { type: 'link', name: 'Drive Thru Orders', iconName: 'driveThru', path: '/driveThruOrders' },
    { type: 'header', name: 'Promo' },
    { type: 'link', name: 'Vouchers', iconName: 'vouchers', path: '/vouchers' },
    { type: 'link', name: 'Offers', iconName: 'offers', path: '/offers' },
    { type: 'header', name: 'Communications' },
    { type: 'link', name: 'Push notification', iconName: 'notification', path: '/notifications' },
    { type: 'link', name: 'Massages', iconName: 'massages', path: '/massages' },
    { type: 'link', name: 'Subscribers', iconName: 'subscribers', path: '/subscribers' },
    { type: 'header', name: 'Users' },
    { type: 'link', name: 'Administrators', iconName: 'administrators', path: '/administrators' },
    { type: 'link', name: 'Delivery Boys', iconName: 'deliveryBoys', path: '/deliveryBoys' },
    { type: 'link', name: 'Customers', iconName: 'customers', path: '/customers' },
    { type: 'link', name: 'Employees', iconName: 'employees', path: '/employees' },
    { type: 'header', name: 'Accounts' },
    { type: 'link', name: 'Transactions', iconName: 'transactions', path: '/transactions' },
    { type: 'header', name: 'Reports' },
    { type: 'link', name: 'Sales reports', iconName: 'salesReports', path: '/salesReports' },
    { type: 'link', name: 'Item reports', iconName: 'itemReports', path: '/itemReports' },
    { type: 'link', name: 'Credit balance report', iconName: 'creditBalanceReport', path: '/creditBalanceReport' },
    { type: 'header', name: 'Setup' },
    { type: 'link', name: 'Settings', iconName: 'settings', path: '/settings' },
  ];

  ngOnInit(): void {
    this.sidebarService.getSidebarState().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });
  }

  route(): string {
    return this.router.url;
  }

  isPosRoute(): boolean {
    return this.router.url === '/pos';
  }

  handleLinkClick(): void {
    if (window.innerWidth < 640) {
      this.sidebarService.toggleSidebar();
    }
  }
}
