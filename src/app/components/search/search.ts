import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Page } from '../page/page';

@Component({
  selector: 'app-search',
  imports: [Page, NzButtonModule, NzIconModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {}
