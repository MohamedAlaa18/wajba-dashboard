import { Component } from '@angular/core';
import { IconComponent } from "../../Components/Shared/icon/icon.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IconComponent, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  // List of profiles
  profiles = [
    { name: 'Kevin Mayer IV', phone: '123456789', imageUrl: 'assets/images/profile.jpeg' },
    { name: 'John Doe', phone: '987654321', imageUrl: 'assets/images/profile.jpeg' },
    { name: 'Jane Smith', phone: '456123789', imageUrl: 'assets/images/profile.jpeg' },
    // Add more profiles as needed
  ];

  // List of chat messages
  messages = [
    { text: 'Hello Mohamed. Thank you for contacting us. My name is Ali. How can I help you?', time: '02:40', isSender: false },
    { text: 'I need help with my order, it is delayed.', time: '02:42', isSender: true },
    // Add more messages as needed
  ];

  // Selected profile index
  selectedProfile = 0;

  // Toggle between profiles
  selectProfile(index: number): void {
    this.selectedProfile = index;
  }

  // Trigger image upload
  triggerImageUpload(): void {
    const fileInput = document.getElementById('uploadImage') as HTMLInputElement;
    fileInput.click();
  }

  // Handle image upload
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Uploaded file:', file);
      // You can now handle the file (e.g., upload to server)
    }
  }
}
