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

  // F1 - REGISTRO DE NUEVA CUENTA
  async registroCuenta() {
    const registro = await this.alertController.create({
      header: 'Registrarme',
      inputs: [
        {
          placeholder: 'Cuenta',
          name: 'user',
        },
        {
          placeholder: 'Contraseña',
          type: 'password',
          name: 'pwd',
        },
        {
          placeholder: 'Repetir contraseña',
          type: 'password',
          name: 'repPwd',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Registrar',
          handler: (data) => {
            this.registrarCuenta(data.user, data.pwd, data.repPwd);
          },
        }
      ],
    });
    await registro.present();
  }

  registrarCuenta(user, pwd, repPwd) {
    if(user == '' || pwd == '' || repPwd == '') {
      this.mostrarMensaje('Por favor ingrese los datos solicitados');
    } else {
      this.db.cuentaNoExiste(user).then((datos) => {
        if(datos) {
          if(pwd == repPwd) {
            this.db.registrarCuenta(user, pwd).then((datos) => {
              if(datos){
                this.mostrarMensaje('La cuenta ha sido creada');
              } else {
                this.mostrarMensaje('No ha sido posible crear la cuenta');
              }
            })
          } else {
            this.mostrarMensaje('La contraseña y su repetición no coinciden');
          }
        } else {
          this.mostrarMensaje('La cuenta ya existe, por favor inicie sesión');
        }
      })
    }
  }

  // F2 - INICIO DE SESIÓN
  ingresar() {
    this.db.autenticar(this.user, this.pwd).then((datos) => {
      if(!datos){
        this.msjeIngreso();
      }
    })
    this.user = '';
    this.pwd = '';
  }

  async msjeIngreso() {
    const alert = await this.alertController.create({
      header: 'Credenciales inválidas',
      message: 'Por favor intente nuevamente o regístrese',
      buttons: ['OK'],
    });
    await alert.present();
  }

  // F3 - CAMBIO DE CONTRASEÑA
  async cambiarPwd() {
    const cambioPwd = await this.alertController.create({
      header: 'Restablecer contraseña',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Ok',
          handler: datos => this.validarCambioPwd(datos.user, datos.curPwd, datos.newPwd, datos.repPwd),
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

  validarCambioPwd(user, curPwd, newPwd, repPwd) {
    if(user == '' || curPwd == '' || newPwd == '' || repPwd == '') {
      this.mostrarMensaje('Por favor ingrese los datos solicitados');
    } else {
      this.db.cuentaExiste(user).then((datos) => {
        if(datos) {
          this.db.validarPwdRegistrada(user, curPwd).then((datos) => {
            if(datos) {
              if(newPwd == repPwd) {
                if(newPwd != curPwd) {
                  this.db.actualizarPwd(user, newPwd).then((datos) => {
                    if(datos) {
                      this.mostrarMensaje('La constraseña ha sido restablecida, por favor inicie sesión');  
                    } else {
                      this.mostrarMensaje('No ha sido posible actualizar la contraseña');  
                    }
                  })
                } else {
                  this.mostrarMensaje('La nueva contraseña no puede ser igual a la contraseña actual');
                }
              } else {
                this.mostrarMensaje('La nueva contraseña y su repetición no coinciden');
              }
            } else {
              this.mostrarMensaje('Credenciales inválidas');
            }
          })
        } else {
          this.mostrarMensaje('Credenciales inválidas');
        }
      })
    }
  }

  // § - MÉTODOS COMPARTIDOS
  async mostrarMensaje(msje) {
    const toast = await this.toastController.create({
      message: msje,
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
