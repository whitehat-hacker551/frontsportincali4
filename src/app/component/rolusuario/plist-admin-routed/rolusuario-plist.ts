import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RolusuarioPlistUnrouted } from '../plist-admin-unrouted/rolusuario-plist-admin-unrouted';

@Component({
  selector: 'app-rolusuario-plist',
  imports: [CommonModule, RouterModule, RolusuarioPlistUnrouted],
  templateUrl: './rolusuario-plist.html',
  styleUrl: './rolusuario-plist.css',
})
export class RolusuarioPlist {}
