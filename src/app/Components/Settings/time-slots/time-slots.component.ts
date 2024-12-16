import { Component, OnInit } from '@angular/core';
import { TimeSlotService } from '../../../Services/TimeSlot/time-slot.service';
import { IWeekDayTimeSlot, WeekDays } from '../../../Models/itime-slot';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from "../../Shared/icon/icon.component";
import { TimeSlotDialogComponent } from '../../Dialogs/time-slot-dialog/time-slot-dialog.component';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IconComponent, TimeSlotDialogComponent],
  templateUrl: './time-slots.component.html',
  styleUrls: ['./time-slots.component.scss']
})
export class TimeSlotsComponent implements OnInit {
  isModalOpen: boolean = false;
  weekDayTimeSlots: IWeekDayTimeSlot[] = [];
  weekDayNames = Object.values(WeekDays).filter(value => typeof value === 'string'); // Get only names
  weekDayIdForModal!: number;

  constructor(private timeSlotService: TimeSlotService) { }

  ngOnInit(): void {
    this.getTimeSlots();
  }

  getTimeSlots(): void {
    this.timeSlotService.getTimeSlots().subscribe(
      (response) => {
        this.weekDayTimeSlots = response.data;
      },
      (error) => {
        console.error('Error fetching time slots:', error);
      }
    );
  }

  getWeekDayName(weekDay: number): string {
    return WeekDays[weekDay];
  }

  onSave(): void {
    console.log("Weekday Time Slot:", this.weekDayTimeSlots);
    this.timeSlotService.updateTimeSlots(this.weekDayTimeSlots).subscribe(
      (response) => {
        console.log('Time slots updated successfully:', response);
      },
      (error) => {
        console.error('Error updating time slots:', error);
      }
    );
  }

  openModal(weekDayId: number) {
    this.weekDayIdForModal = weekDayId;
    this.isModalOpen = true;
  }

  addNewTimeSlot(newSlot: { openingTime: string; closingTime: string }, weekDayId: number) {
    const weekDay = this.weekDayTimeSlots.find(day => day.weekDay === weekDayId);
    if (weekDay) {
      const newSlotId = this.getNextSlotId(weekDay.timeSlots);
      weekDay.timeSlots.push({ id: newSlotId, ...newSlot });
      this.isModalOpen = false; // Close the modal after adding
    }
  }

  private getNextSlotId(timeSlots: any[]): number {
    return timeSlots.length > 0 ? Math.max(...timeSlots.map(slot => slot.id)) + 1 : 1;
  }

  // Method to delete a time slot
  deleteTimeSlot(weekDayId: number, slotId: number) {
    const weekDay = this.weekDayTimeSlots.find(day => day.weekDay === weekDayId);
    if (weekDay) {
      weekDay.timeSlots = weekDay.timeSlots.filter(slot => slot.id !== slotId);
    }
  }
}
