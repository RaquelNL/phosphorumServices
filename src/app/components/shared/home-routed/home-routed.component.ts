import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

interface IIndividuo { nombre: string; edad: number; sexo: string };

interface IUser {
  id: number;
  name: string;
  surname: string;
  lastname: string;
  email: string;
  username: string;
  role: boolean;
  threads: number;
  replies: number
}

@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})

export class HomeRoutedComponent implements OnInit {

  title: string = 'phosphorum';
  datos: IUser = { id: 0, name: "", surname: "", lastname: "", email: "", username: "", role: false, threads: 0, replies: 0 };
  urlimagen: string = "https://estaticos-cdn.sport.es/clip/885c9147-8b6a-4bc9-8937-aa27780bfabd_media-libre-aspect-ratio_default_0.jpg";
  w: string = "400";
  personas: string[] = ['Antoni', 'Luis', 'Maria', 'Pedro', 'Juan', 'Jose', 'Ana', 'Luisa'];
  texto: string = "textorojo";
  cuatro: number = 4;
  mitexto: string = "Mi texto";
  condition: boolean = true;
  id: number = 1;
  poblacion: IIndividuo[] = [
    {
      nombre: "Antonio",
      edad: 20,
      sexo: "M"
    },
    {
      nombre: "Maria",
      edad: 30,
      sexo: "F"
    },
    {
      nombre: "Luis",
      edad: 40,
      sexo: "M"
    },
    {
      nombre: "Ana",
      edad: 50,
      sexo: "F"
    },
    {
      nombre: "Pedro",
      edad: 60,
      sexo: "M"
    },
    {
      nombre: "Luisa",
      edad: 70,
      sexo: "F"
    },
    {
      nombre: "Juan",
      edad: 80,
      sexo: "M"
    },
    {
      nombre: "Jose",
      edad: 90,
      sexo: "M"
    }
  ]

  constructor(
    private http: HttpClient
  ) { }
  ngOnInit() {
  }


  saludar(): void {
    alert("Hola");
  }

  escribir(): void {
    console.log("Escribiendo");
  }

  cargar(): void {
    console.log("Cargando AJAX...");

    this.http.get("http://localhost:8083/user/" + this.id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.datos = data;
      },
      error: (error: any) => {
        console.log(error);
      }

    })

  }

}





