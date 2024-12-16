import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../../Shared/icon/icon.component';
import { FAQsService } from '../../../Services/FAQs/faqs.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  questionAnswerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private faqsService: FAQsService
  ) {
    this.questionAnswerForm = this.fb.group({
      questions: this.fb.array([])
    });

    this.addQuestion();
  }

  // Get the form array of questions
  get questions(): FormArray {
    return this.questionAnswerForm.get('questions') as FormArray;
  }

  // Create a new question-answer form group
  createQuestionAnswer(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  // Add a new question-answer form group to the form array
  addQuestion() {
    this.questions.push(this.createQuestionAnswer());
  }

  // Remove a question-answer form group from the form array
  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  // Save the form data
  // Save the form data
  onSave() {
    if (this.questionAnswerForm.valid) {
      const faqsData = this.questionAnswerForm.value.questions;
      console.log("faqsData : " + faqsData);
      // Call the FAQsService to send the form data via a POST request
      this.faqsService.createFAQs(faqsData).subscribe(
        response => {
          console.log('FAQs submitted successfully:', response);
          this.resetForm(); // Reset the form after successful submission
        },
        error => {
          console.error('Error submitting FAQs:', error);
          // Consider adding user-friendly feedback here
        }
      );
    } else {
      this.questionAnswerForm.markAllAsTouched();
    }
  }

  // Reset form after submission
  resetForm() {
    this.questionAnswerForm.reset();
    while (this.questions.length) {
      this.questions.removeAt(0);
    }
    this.addQuestion();
  }
}
