import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './admin-reply-edit-routed.component.html',
  styleUrls: ['./admin-reply-edit-routed.component.css']
})
export class AdminReplyEditRoutedComponent implements OnInit{

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }
}
