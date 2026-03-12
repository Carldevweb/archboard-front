import { CommonModule, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { BoardActivity } from '../../models/board-activity.model';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './activity-feed.html',
  styleUrl: './activity-feed.scss',
})
export class ActivityFeedComponent {
  readonly activities = input<BoardActivity[]>([]);
  readonly isLoading = input<boolean>(false);
}