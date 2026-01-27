import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { SharedModule } from '../../shared/shared.module';
import Chart, { CategoryScale } from 'chart.js/auto';
import { DatePipe } from '@angular/common';

Chart.register(CategoryScale);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DatePipe]
})
export class DashboardComponent {

  statsData:any;

  workouts: any;
  activities: any;

  @ViewChild('workoutLineChart') private workoutLineChartRef:ElementRef;
  @ViewChild('activityLineChart') private activityLineChartRef:ElementRef;
  

  constructor(private userService: UserService,
    private datePipe:DatePipe
  ){}

  ngOnInit(){
    this.getStats();
    this.getGraphStats();
  }

  getGraphStats(){
    this.userService.getGraphStats().subscribe(res=>{
      this.workouts = res.workouts;
      this.activities = res.activities;
      console.log(this.workouts, this.activities);
      if(this.workoutLineChartRef || this.workoutLineChartRef){
        this.createLineChart();
      }
    })
  }

  ngAfterViewInit(){
    if(this.workouts && this.activities){
      this.createLineChart();
    }
  }

  createLineChart(){
    const workoutCtx = this.workoutLineChartRef.nativeElement.getContext('2d');
    const activityCtx = this.activityLineChartRef.nativeElement.getContext('2d');

    new Chart(workoutCtx, {
      type: 'line',
      data: {
        labels: this.workouts.map((data: {date:any;})=> this.datePipe.transform(data.date, 'MM/dd')),
        datasets: [
          {
          label: 'Calories Burned',
          data: this.workouts.map((data: { caloriesBurned: any; }) => data.caloriesBurned),
          fill: false,
            borderWidth: 2,
            backgroundColor: 'rgba(80, 200, 120, 0.6)',
            borderColor: 'rgba(0, 100, 0, 1)',
        },
        {
          label: 'Duration',
          data: this.workouts.map((data: { duration: any; })=> data.duration),
          fill: false,
            borderWidth: 2,
            backgroundColor: 'rgba(120, 180, 200, 0.6)',
            borderColor: 'rgba(0, 100, 150, 1)',
        }
      ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(activityCtx, {
      type: 'line',
      data: {
        labels: this.activities.map((data: {date:any;})=> this.datePipe.transform(data.date, 'MM/dd')),
        datasets: [
          {
          label: 'Calories Burned',
          data: this.activities.map((data: { caloriesBurned: any; }) => data.caloriesBurned),
          fill: false,
            borderWidth: 2,
            backgroundColor: 'rgba(255, 100, 100, 0.6)',
            borderColor: 'rgba(255, 0, 0, 1)',
        },
        {
          label: 'Steps',
          data: this.activities.map((data: { steps: any; })=> data.steps),
          fill: false,
            borderWidth: 2,
            backgroundColor: 'rgba(255, 180, 120, 0.6)',
            borderColor: 'rgba(255, 100, 0, 1)',
        },{
          label: 'Distance',
          data: this.activities.map((data: { distance: any; }) => data.distance),
          fill: false,
            borderWidth: 2,
            backgroundColor: 'rgba(255, 200, 200, 0.6)',
            borderColor: 'rgba(255, 0, 100, 1)',
        }
      ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
  }

  getStats() {
    this.userService.getStats().subscribe(res=>{
      console.log(res);
      this.statsData = res;
    })
  }

}
