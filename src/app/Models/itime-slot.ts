export interface IWeekDayTimeSlot {
  id: number;
  weekDay: number;
  timeSlots: ITimeSlot[];
}

export interface ITimeSlot {
  id: number;
  openingTime: string;
  closingTime: string;
}

export enum WeekDays {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}
