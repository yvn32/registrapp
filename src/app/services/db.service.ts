import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  personaValida: string = 'mar.lara';
  passwordValida: string = '1111';
  validador: boolean = false;

  constructor(private router: Router, private sqlite: SQLite) {
    this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS PERSONA(CUENTA VARCHAR(50), CONTRASENA VARCHAR(30))', []).then(() => {
        console.log('YVN: TABLA CREADA OK');
      }).catch(error => {
        console.log('YVN: TABLA NOK');
      })
    }).catch(error => {
      console.log('YVN: BASE DE DATOS NOK');
    })
  }

  registrarPersona(user, pwd) {
    this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO PERSONA VALUES(?, ?)', [user, pwd]).then(() => {
        console.log('YVN: PERSONA ALMACENADA OK');
      }).catch(error => {
        console.log('YVN: PERSONA NO ALMACENADA');
      })
    }).catch(error => {
      console.log('YVN: BASE DE DATOS NOK');
    })
  }

  canActivate() {
    if(this.validador) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  autenticar(user, pwd) {

    let extras: NavigationExtras = {
      state: {
        user: user,
        msje: 'Bienvenid@ '
      }
    }

    if(user == this.personaValida && pwd == this.passwordValida) {
      this.validador = true;
      this.router.navigate(['inicio'], extras);
      return true;
    } else {
      return false;
    }
  }

  validarCambio(user, curPwd, newPwd, repPwd){
    
    let msje = '';

    if(user == '' || curPwd == '' || newPwd == '' || repPwd == '') {
      msje = 'Por favor ingrese los datos solicitados';
    } else {
        if(user == this.personaValida && curPwd == this.passwordValida) {
          if(newPwd == repPwd){
            if(newPwd != curPwd) {
              this.passwordValida = newPwd;
              msje = 'Su constraseña ha sido restablecida, por favor inicie sesión';
            } else {
              msje = 'La nueva contraseña no puede ser igual a la contraseña actual, por favor intente nuevamente';
            }
          } else {
            msje = 'La nueva contraseña y su repetición no coinciden, por favor intente nuevamente';
          }
        } else {
          msje = 'Las credenciales ingresadas son inválidas, no es posible restablecer la contraseña';
        }
    }
    return msje;
  }

}
