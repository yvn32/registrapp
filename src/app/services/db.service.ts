import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  validador: boolean = false;

  constructor(private router: Router, private sqlite: SQLite) {
    this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS PERSONA(CUENTA VARCHAR(50), CONTRASENA VARCHAR(30))', []).then(() => {
        console.log('YVN: constructor: TABLA CREADA OK');
      }).catch(error => {
        console.log('YVN: constructor: TABLA NOK');
      })
    }).catch(error => {
      console.log('YVN: constructor: BASE DE DATOS NOK');
    })
  }

  // F1 - REGISTRO DE NUEVA CUENTA
  cuentaNoExiste(user) {
     return this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(CUENTA) AS CANTIDAD FROM PERSONA WHERE CUENTA = ?', [user]).then((datos) => {
        if(datos.rows.item(0).CANTIDAD === 0) {
          return true; //true: cuenta no exite en la tabla -> permite guardarla
        }
        console.log('YVN: cuentaNoExiste: LA CUENTA YA EXISTE EN LA TABLA');
        return false; //false: cuenta existe en la tabla -> no permite guardarla nuevamente
      }).catch(error => {
        console.log('YVN: cuentaNoExiste: ERROR');
        return false; //retorna false en caso de error para no permitir guardar cuenta
      })
    }).catch(error => {
      console.log('YVN: cuentaNoExiste: ERROR');
      return false; //retorna false en caso de error para no permitir guardar cuenta
    });
  }

  registrarCuenta(user, pwd) {
    return this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('INSERT INTO PERSONA VALUES(?, ?)', [user, pwd]).then(() => {
        console.log('YVN: registrarCuenta: CUENTA ALMACENADA OK');
        return true;
      }).catch(error => {
        console.log('YVN: registrarCuenta: CUENTA NO ALMACENADA');
        return false;
      })
    }).catch(error => {
      console.log('YVN: registrarCuenta: BASE DE DATOS NOK');
      return false;
    })
  }

  // F2 - INICIO DE SESIÓN
  autenticar(user, pwd) {
    let extras: NavigationExtras = {
      state: {
        user: user,
        msje: 'Bienvenid@ '
      }
    }
    return this.cuentaExiste(user).then((datos) => {
      if(datos) {
        return this.validarPwdRegistrada(user, pwd).then((datos) => {
          if(datos) {
            console.log('YVN: autenticar: LA AUTENTICACIÓN RESULTÓ OK');
            this.validador = true;
            this.router.navigate(['inicio'], extras);
            return true;
          } else {
            console.log('YVN: autenticar: LA AUTENTICACIÓN RESULTÓ NOK');
            return false;
          }
        })
      } else {
        console.log('YVN: autenticar: LA CUENTA NO EXISTE');
        return false;
      }
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

  // F3 - CAMBIO DE CONTRASEÑA
  actualizarPwd(user, pwd) {
    return this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('UPDATE PERSONA SET CONTRASENA = ? WHERE CUENTA = ?', [pwd, user]).then(() => {
        console.log('YVN: actualizarPwd: CONTRASEÑA ACTUALIZADA');
        return true;
      }).catch(error => {
        console.log('YVN: actualizarPwd: ERROR');
        return false;
      })
    }).catch(error => {
      console.log('YVN: actualizarPwd: ERROR');
      return false;
    });
  }

  // § - MÉTODOS COMPARTIDOS
  cuentaExiste(user) {
    return this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT COUNT(CUENTA) AS CANTIDAD FROM PERSONA WHERE CUENTA = ?', [user]).then((datos) => {
        if(datos.rows.item(0).CANTIDAD > 0) {
          return true; //true: cuenta exite en la tabla
        }
        console.log('YVN: cuentaExiste: LA CUENTA NO EXISTE EN LA TABLA');
        return false; //false: cuenta no existe en la tabla -> no permite iniciar sesión
      }).catch(error => {
        console.log('YVN: ERROR');
        return false; //retorna false en caso de error para no permitir inicio de sesión
      })
    }).catch(error => {
      console.log('YVN: ERROR');
      return false; //retorna false en caso de error para no permitir incio de sesión
    });
  }
  
  validarPwdRegistrada(user, pwd) {
    return this.sqlite.create({
      name: 'datos.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT CONTRASENA AS PWD FROM PERSONA WHERE CUENTA = ?', [user]).then((datos) => {
        console.log('YVN: validarPwdRegistrada: PWD OBTENIDA: ' + datos.rows.item(0).PWD);
        if(pwd == datos.rows.item(0).PWD) {
          console.log('YVN: validarPwdRegistrada: PWD COINCIDE --> AUTENTICAR');
          return true;
        } else {
          console.log('YVN: validarPwdRegistrada: PWD NO COINCIDE --> NO AUTENTICAR');
          return false;
        }
      }).catch(error => {
        console.log('YVN: validarPwdRegistrada: NO PUDE OBTENER LA PWD REGISTRADA');
        return false;
      })
    }).catch(error => {
      console.log('YVN: validarPwdRegistrada: NO PUDE OBTENER LA PWD REGISTRADA');
      return false;
    });
  }

}
