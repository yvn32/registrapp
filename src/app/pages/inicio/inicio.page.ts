import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  user: string = '';
  msje: string = '';
  escaneando: boolean = false;

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

  async revisarPermiso() {
    return new Promise(async (resolve, reject) => {
      const estado = await BarcodeScanner.checkPermission({ force: true });
      if (estado.granted) {
        resolve(true);
      } else if (estado.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async iniciarScanner() {
    const permitido = await this.revisarPermiso();

    if (permitido) {
      this.escaneando = true;
      BarcodeScanner.hideBackground();

      const resultado = await BarcodeScanner.startScan();

      if (resultado.hasContent) {
        this.escaneando = false;
        alert(resultado.content);
      } else {
        alert('No se encontraron datos');
      }
    } else {
      alert('No permitido');
    }
  }

  detenerScanner() {
    BarcodeScanner.stopScan();
    this.escaneando = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.escaneando = false;
  }

}
