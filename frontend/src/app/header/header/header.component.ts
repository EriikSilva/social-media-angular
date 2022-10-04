import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {Subscription} from "rxjs"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  userAuthenticated = false
  private authListenerSubs:Subscription;

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated; //verifica se ta logado e autenticado
    })
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe()
  }
}
