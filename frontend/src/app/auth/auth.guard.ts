// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   RouterStateSnapshot,
//   UrlTree,
// } from '@angular/router';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';

// @Injectable()
// export class AuthGuard implements CanActivate {

//    constructor(private authService:AuthService, private router: Router){} 

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | UrlTree | Observable<boolean> | Promise<boolean> {
//         const isAuth = this.authService.getIsAuth();
//         console.log('@Estava logado antes? ', isAuth)
//         if(!isAuth){
//             this.router.navigate(['/login'])
//             console.log('guard', isAuth)
//         }

//         console.log('guard', isAuth)
//         return isAuth;

//     }
// }


import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }
}

