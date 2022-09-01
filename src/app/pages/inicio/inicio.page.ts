import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  user: string = '';
  msje: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.user = this.router.getCurrentNavigation().extras.state.user;
    this.msje = this.router.getCurrentNavigation().extras.state.msje;

    // try {
    //   this.user = this.router.getCurrentNavigation().extras.state.user;
    //   this.msje = this.router.getCurrentNavigation().extras.state.msje;
    // } catch(error) {
    //   this.router.navigate(['login']);
    // }
  }

}
