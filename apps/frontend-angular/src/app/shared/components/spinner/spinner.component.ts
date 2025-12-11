import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() fullScreen = false;
  @Input() message = '';
}
