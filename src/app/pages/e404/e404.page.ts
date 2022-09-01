import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-e404',
  templateUrl: './e404.page.html',
  styleUrls: ['./e404.page.scss'],
})
export class E404Page implements OnInit {

  constructor(private router: Router, private animationCtrl: AnimationController) { }

  ngOnInit() {
    const boton = this.animationCtrl.create()
    .addElement(document.querySelector('.animado'))
    .duration(2000)
    .keyframes([
      { offset: 0, transform: 'scale(1))', opacity: '1' },
      { offset: 0.5, transform: 'scale(0.7)', opacity: '0.1' },
      { offset: 1, transform: 'scale(1)', opacity: '1' }
  ]);

  const parent = this.animationCtrl.create()
    .duration(1000)
    .iterations(2)
    .addAnimation([boton]).play();
  }

  volver() {
    this.router.navigate(['login']);
  }

}
