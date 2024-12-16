export interface INotification {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  roleId: number;
  userId: number;
  roleName: string;
  userName: string;
  date: string;
}

export interface NotificationSettings {
  notificationType: string;
  events: NotificationEvent[];
}

export interface NotificationEvent {
  id: number;
  eventName: string;
  eventDescription: string;
  isEnabled: boolean;
}
