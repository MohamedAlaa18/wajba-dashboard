import { Routes } from '@angular/router';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { ItemsComponent } from './Pages/Item/items/items.component';
import { UsersComponent } from './Pages/User/users/users.component';
import { UserDetailsComponent } from './Pages/User/user-details/user-details.component';
import { DiningTablesComponent } from './Pages/DiningTables/dining-tables/dining-tables.component';
import { DiningTablesDetailsComponent } from './Pages/DiningTables/dining-tables-details/dining-tables-details.component';
import { OrdersComponent } from './Pages/Order/orders/orders.component';
import { OrderDetailsComponent } from './Pages/Order/order-details/order-details.component';
import { OrderDetailsPosComponent } from './Pages/Order/order-details-pos/order-details-pos.component';
import { POSComponent } from './Pages/pos/pos.component';
import { PushNotificationComponent } from './Pages/Notification/push-notification/push-notification.component';
import { PushNotificationDetailsComponent } from './Pages/Notification/push-notification-details/push-notification-details.component';
import { SubscribersComponent } from './Pages/subscribers/subscribers.component';
import { TransactionsComponent } from './Pages/transactions/transactions.component';
import { SalesReportsComponent } from './Pages/sales-reports/sales-reports.component';
import { CreditBalanceReportComponent } from './Pages/credit-balance-report/credit-balance-report.component';
import { ItemReportsComponent } from './Pages/item-reports/item-reports.component';
import { ChatComponent } from './Pages/chat/chat.component';
import { SettingsComponent } from './Pages/settings/settings.component';
import { ItemDetailsComponent } from './Pages/Item/ItemDetails/item-details/item-details.component';
import { OfferDetailsComponent } from './Pages/Offer/offer-details/offer-details.component';
import { OffersComponent } from './Pages/Offer/offers/offers.component';
import { VouchersComponent } from './Pages/Vouchers/vouchers/vouchers.component';
import { VoucherDetailsComponent } from './Pages/Vouchers/voucher-details/voucher-details.component';
import { PopularTodayComponent } from './Pages/popular-today/popular-today.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'item/:id', component: ItemDetailsComponent },
  { path: 'popular', component: PopularTodayComponent },
  { path: 'popular/:id', component: ItemDetailsComponent },
  { path: 'tables', component: DiningTablesComponent },
  { path: 'table/:id', component: DiningTablesDetailsComponent },
  { path: 'pos', component: POSComponent },
  { path: 'posOrders', component: OrdersComponent },
  { path: 'tableOrders', component: OrdersComponent },
  { path: 'deliveryOrders', component: OrdersComponent },
  { path: 'pickupOrders', component: OrdersComponent },
  { path: 'dineInOrders', component: OrdersComponent },
  { path: 'driveThruOrders', component: OrdersComponent },
  { path: 'order/:id', component: OrderDetailsComponent },
  { path: 'orderPos/:id', component: OrderDetailsPosComponent },
  { path: 'vouchers', component: VouchersComponent },
  { path: 'voucher/:id', component: VoucherDetailsComponent },
  { path: 'offers', component: OffersComponent },
  { path: 'offer/:id', component: OfferDetailsComponent },
  { path: 'notifications', component: PushNotificationComponent },
  { path: 'notification/:id', component: PushNotificationDetailsComponent },
  { path: 'massages', component: ChatComponent },
  { path: 'subscribers', component: SubscribersComponent },
  { path: 'administrators', component: UsersComponent },
  { path: 'deliveryBoys', component: UsersComponent },
  { path: 'customers', component: UsersComponent },
  { path: 'employees', component: UsersComponent },
  { path: 'user/:id', component: UserDetailsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'salesReports', component: SalesReportsComponent },
  { path: 'itemReports', component: ItemReportsComponent },
  { path: 'creditBalanceReport', component: CreditBalanceReportComponent },
  { path: 'settings', component: SettingsComponent },

  // Adding the missing routes from menuItems
  { path: 'company', component: DashboardComponent },
  { path: 'site', component: DashboardComponent },
  { path: 'branches', component: DashboardComponent },
  { path: 'email', component: DashboardComponent },
  { path: 'orderSetup', component: DashboardComponent },
  { path: 'OTP', component: DashboardComponent },
  { path: 'notification', component: DashboardComponent },
  { path: 'notificationAlert', component: DashboardComponent },
  { path: 'socialMedia', component: DashboardComponent },
  { path: 'aboutUs', component: DashboardComponent },
  { path: 'analytics', component: DashboardComponent },
  { path: 'theme', component: DashboardComponent },
  { path: 'timeSlots', component: DashboardComponent },
  { path: 'sliders', component: DashboardComponent },
  { path: 'currencies', component: DashboardComponent },
  { path: 'itemCategories', component: DashboardComponent },
  { path: 'itemAttributes', component: DashboardComponent },
  { path: 'taxes', component: DashboardComponent },
  { path: 'pages', component: DashboardComponent },
  { path: 'role', component: DashboardComponent },
  { path: 'languages', component: DashboardComponent },
  { path: 'smsGateway', component: DashboardComponent },
  { path: 'paymentGateway', component: DashboardComponent },
  { path: 'license', component: DashboardComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];