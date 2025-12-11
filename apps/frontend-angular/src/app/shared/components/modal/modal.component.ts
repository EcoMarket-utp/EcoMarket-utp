import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ModalComponent implements OnInit {
  isVisible = false;
  config: ModalConfig | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe((config) => {
      this.config = config;
      this.isVisible = !!config;
    });
  }

  confirm(): void {
    this.modalService.close(true);
  }

  cancel(): void {
    this.modalService.close(false);
  }

  close(): void {
    this.modalService.close(false);
  }
}
