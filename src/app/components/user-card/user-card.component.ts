import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatMenuModule} from '@angular/material/menu';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports:[CommonModule,RouterModule,MatProgressSpinnerModule,MatMenuModule,MatPaginatorModule]
,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent { 
  user=input<User>()
}
