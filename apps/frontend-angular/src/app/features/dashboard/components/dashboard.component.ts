import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/shared/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  orders: any[] = [];
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.user = user;
      },
    });
  }
}
