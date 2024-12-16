import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../Components/Shared/icon/icon.component';
import { SidebarService } from '../../Services/Sidebar/sidebar.service';
import { CompanyComponent } from '../../Components/Settings/company/company.component';
import { SiteComponent } from '../../Components/Settings/site/site.component';
import { BranchesComponent } from '../../Components/Settings/branches/branches.component';
import { EmailComponent } from '../../Components/Settings/email/email.component';
import { OrderSetupComponent } from '../../Components/Settings/order-setup/order-setup.component';
import { OTPComponent } from '../../Components/Settings/otp/otp.component';
import { NotificationComponent } from '../../Components/Settings/notification/notification.component';
import { NotificationAlertComponent } from '../../Components/Settings/notification-alert/notification-alert.component';
import { SocialMediaComponent } from '../../Components/Settings/social-media/social-media.component';
import { AboutUsComponent } from '../../Components/Settings/about-us/about-us.component';
import { AnalyticsComponent } from '../../Components/Settings/analytics/analytics.component';
import { ThemeComponent } from '../../Components/Settings/theme/theme.component';
import { TimeSlotsComponent } from '../../Components/Settings/time-slots/time-slots.component';
import { SlidersComponent } from '../../Components/Settings/sliders/sliders.component';
import { CurrenciesComponent } from '../../Components/Settings/currencies/currencies.component';
import { ItemCategoriesComponent } from '../../Components/Settings/item-categories/item-categories.component';
import { ItemAttributesComponent } from '../../Components/Settings/item-attributes/item-attributes.component';
import { TaxesComponent } from '../../Components/Settings/taxes/taxes.component';
import { PagesComponent } from '../../Components/Settings/pages/pages.component';
import { RoleAndPermissionsComponent } from '../../Components/Settings/role-and-permissions/role-and-permissions.component';
import { LanguagesComponent } from '../../Components/Settings/languages/languages.component';
import { SmsGatewayComponent } from '../../Components/Settings/sms-gateway/sms-gateway.component';
import { LicenseComponent } from '../../Components/Settings/license/license.component';
import { ItemCategoriesDetailsComponent } from "../../Components/Settings/item-categories-details/item-categories-details.component";
import { LanguagesDetailsComponent } from "../../Components/Settings/languages-details/languages-details.component";
import { RoleAndPermissionsDetailsComponent } from "../../Components/Settings/role-and-permissions-details/role-and-permissions-details.component";
import { BranchesDetailsComponent } from "../../Components/Settings/branches-details/branches-details.component";
import { BreadcrumbComponent } from '../../Components/Shared/breadcrumb/breadcrumb.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    IconComponent,
    CommonModule,
    RouterModule,
    CompanyComponent,
    SiteComponent,
    BranchesComponent,
    EmailComponent,
    OrderSetupComponent,
    OTPComponent,
    NotificationComponent,
    NotificationAlertComponent,
    SocialMediaComponent,
    AboutUsComponent,
    AnalyticsComponent,
    ThemeComponent,
    TimeSlotsComponent,
    SlidersComponent,
    CurrenciesComponent,
    ItemCategoriesComponent,
    ItemAttributesComponent,
    TaxesComponent,
    PagesComponent,
    RoleAndPermissionsComponent,
    LanguagesComponent,
    SmsGatewayComponent,
    LicenseComponent,
    ItemCategoriesDetailsComponent,
    LanguagesDetailsComponent,
    RoleAndPermissionsDetailsComponent,
    BranchesDetailsComponent,
    BreadcrumbComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  selectedName: string = '';
  breadcrumbs: any;
  private selectedNameSub!: Subscription;

  constructor(private sidebarService: SidebarService) { }

  menuItems = [
    { type: 'link', name: 'Company', iconName: 'company' },
    { type: 'link', name: 'Site', iconName: 'site' },
    { type: 'link', name: 'Branches', iconName: 'branches' },
    { type: 'link', name: 'Email', iconName: 'email' },
    { type: 'link', name: 'Order Setup', iconName: 'orderSetup' },
    { type: 'link', name: 'OTP', iconName: 'OTP' },
    { type: 'link', name: 'Notification', iconName: 'notification_2' },
    { type: 'link', name: 'Notification Alert', iconName: 'notificationAlert' },
    { type: 'link', name: 'Social Media', iconName: 'socialMedia' },
    { type: 'link', name: 'FAQs', iconName: 'aboutUs' },
    { type: 'link', name: 'Analytics', iconName: 'analytics' },
    { type: 'link', name: 'Theme', iconName: 'theme' },
    { type: 'link', name: 'Time Slots', iconName: 'timeSlots' },
    { type: 'link', name: 'Sliders', iconName: 'sliders' },
    { type: 'link', name: 'Currencies', iconName: 'currencies' },
    { type: 'link', name: 'Item categories', iconName: 'itemCategories' },
    { type: 'link', name: 'Item Attributes', iconName: 'itemAttributes' },
    { type: 'link', name: 'Taxes', iconName: 'taxes' },
    { type: 'link', name: 'Pages', iconName: 'pages' },
    { type: 'link', name: 'Role & Permissions', iconName: 'role' },
    { type: 'link', name: 'Languages', iconName: 'languages' },
    { type: 'link', name: 'Sms Gateway', iconName: 'smsGateway' },
    { type: 'link', name: 'License', iconName: 'license' },
  ];

  ngOnInit(): void {
    this.sidebarService.getSidebarState().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });

    this.selectedNameSub = this.sidebarService.getSelectedComponentName().subscribe((name) => {
      this.selectedName = name;
      this.updateBreadcrumbs();
    });

    const storedName = localStorage.getItem('selectedComponentName');
    if (storedName) {
      this.sidebarService.setSelectedComponentName(storedName);
    }
  }

  ngOnDestroy(): void {
    if (this.selectedNameSub) {
      this.selectedNameSub.unsubscribe();
    }
  }

  updateBreadcrumbs() {
    const selectedComponentName = localStorage.getItem('selectedComponentName');
    this.selectedName = selectedComponentName || '';

    if (selectedComponentName && selectedComponentName.includes(' Details')) {
      this.breadcrumbs = [
        { name: 'Dashboard', link: '/' },
        { name: 'Settings', link: '/settings' },
        { name: `${this.selectedName.replace(' Details', '')}`, link: '/settings' },
        { name: 'View', link: '' },
      ];
    } else {
      this.breadcrumbs = [
        { name: 'Dashboard', link: '/' },
        { name: 'Settings', link: '/settings' },
        { name: `${this.selectedName}`, link: '/settings' },
      ];
    }
  }

  loadComponent(name: string) {
    localStorage.setItem('selectedComponentName', name);
    this.sidebarService.setSelectedComponentName(name);
  }
}
