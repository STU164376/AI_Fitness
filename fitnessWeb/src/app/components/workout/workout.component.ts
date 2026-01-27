import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../service/user.service';
import { GeminiService } from '../../service/gemini.service';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent {

  gridStyle = {
    width: '100%',
    textAlign: 'center'
  };

  workoutForm!: FormGroup;

  listOfType: any[] = [
    "Cardio",
    "Strength",
    "Flexibility",
    "HIIT",
    "Pilates",
    "Dance",
    "Swimming",
    "Cycling",
    "Running",
    "Walking",
    "Boxing",
    "CrossFit",
    "Rowing",
    "Stretching",
    "Martial Arts",
    "Gymnastics",
    "Climbing",
    "Plyometrics"
  ];

  workouts: any;

  // Timer Modal Properties
  isModalVisible: boolean = false;
  selectedWorkoutType: string = '';
  isWorkoutStarted: boolean = false;
  isWorkoutEnded: boolean = false;
  isCalculating: boolean = false;

  // Timer Properties
  timerInterval: any;
  elapsedSeconds: number = 0;
  displayTime: string = '00:00:00';

  // Result Properties
  estimatedCalories: number = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService,
    private geminiService: GeminiService
  ) {}

  ngOnInit(){
    this.workoutForm = this.fb.group({
      type: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      date: [null, [Validators.required]],
      caloriesBurned: [null, [Validators.required]]
    });
    this.getWorkouts();
  }

  getWorkouts(){
    this.userService.getWorkouts().subscribe(res=>{
      this.workouts = res;
    })
  }

  submitForm(){
    this.userService.postWorkout(this.workoutForm.value).subscribe(res=>{
      this.message.success("Workout posted successfully", { nzDuration: 5000 });
      this.workoutForm.reset();
      this.getWorkouts();
    }, error=>{
      this.message.error("Error while posting workout", { nzDuration: 5000 });
    })
  }

  // Modal Methods
  openModal(): void {
    this.isModalVisible = true;
    this.resetModalState();
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.stopTimer();
    this.resetModalState();
  }

  resetModalState(): void {
    this.selectedWorkoutType = '';
    this.isWorkoutStarted = false;
    this.isWorkoutEnded = false;
    this.isCalculating = false;
    this.elapsedSeconds = 0;
    this.displayTime = '00:00:00';
    this.estimatedCalories = 0;
  }

  // Timer Methods
  startWorkout(): void {
    if (!this.selectedWorkoutType) {
      this.message.warning('Please select a workout type first!', { nzDuration: 3000 });
      return;
    }
    this.isWorkoutStarted = true;
    this.elapsedSeconds = 0;
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.updateDisplayTime();
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateDisplayTime(): void {
    const hours = Math.floor(this.elapsedSeconds / 3600);
    const minutes = Math.floor((this.elapsedSeconds % 3600) / 60);
    const seconds = this.elapsedSeconds % 60;
    this.displayTime =
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');
  }

  async endWorkout(): Promise<void> {
    this.stopTimer();
    this.isWorkoutEnded = true;
    this.isCalculating = true;

    // Use actual decimal minutes for more accurate calorie estimation
    const actualMinutes = this.elapsedSeconds / 60;

    try {
      const calories = await this.geminiService.estimateCalories(
        this.selectedWorkoutType,
        actualMinutes
      );
      this.estimatedCalories = calories;
      this.isCalculating = false;
    } catch (error) {
      console.error('Error estimating calories:', error);
      this.message.error('Failed to estimate calories. Using default calculation.', { nzDuration: 5000 });
      this.estimatedCalories = Math.round(actualMinutes * 5);
      this.isCalculating = false;
    }
  }

  saveWorkout(): void {
    // Round to nearest minute, minimum 1 minute
    const durationMinutes = Math.max(1, Math.round(this.elapsedSeconds / 60));

    const workoutData = {
      type: this.selectedWorkoutType,
      duration: durationMinutes,
      date: new Date(),
      caloriesBurned: this.estimatedCalories
    };

    this.userService.postWorkout(workoutData).subscribe({
      next: (res) => {
        this.message.success('Workout saved successfully!', { nzDuration: 5000 });
        this.closeModal();
        this.getWorkouts();
      },
      error: (err) => {
        this.message.error('Error saving workout', { nzDuration: 5000 });
      }
    });
  }
}
