import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: string = '';
  pwd: string = '';

  constructor(
    private router: Router,
    private db: DbService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  ingresar() {
    if (!this.db.autenticar(this.user, this.pwd)) {
      this.mostrarMensaje();
    };
    this.user = '';
    this.pwd = '';
  }

  async mostrarMensaje() {
    const alert = await this.alertController.create({
      header: 'Credenciales inválidas',
      message: 'Por favor intente nuevamente o regístrese',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async cambiarPwd() {
    const cambioPwd = await this.alertController.create({
      header: 'Restablecer contraseña',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Ok',
          handler: datos => this.mostrarMsjeCambioPwd(this.db.validarCambio(datos.user, datos.curPwd, datos.newPwd, datos.repPwd)),
        }
      ],
      inputs: [
        {
          placeholder: 'Cuenta',
          name: 'user',
        },
        {
          placeholder: 'Contraseña actual',
          type: 'password',
          name: 'curPwd',
        },
        {
          placeholder: 'Nueva contraseña',
          type: 'password',
          name: 'newPwd',
        },
        {
          placeholder: 'Repetir nueva contraseña',
          type: 'password',
          name: 'repPwd',
        },
      ],
    });
    await cambioPwd.present();
  }

  async mostrarMsjeCambioPwd(resultado) {
    const toast = await this.toastController.create({
      message: resultado,
      duration: 4000,
      color: "dark",
      position: 'middle',
      buttons: [{
        side: 'end',
        text: 'Ok',
      }]
    });
    toast.present();
  }

}
