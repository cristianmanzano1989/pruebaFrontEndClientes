import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  sharedKey: string;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  /**
   * on init
   */
  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.getClientes(page);
    });
  }

  /**
   * Gets clientes
   * @param page 
   */
  public getClientes(page: number) {
    this.clienteService.getClientes(page)
    .pipe(
      tap(response => {
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      })
    ).subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
      this.fillSharedKey();
    });
  }

  /**
   * Fills shared key
   */
  public fillSharedKey() {
     this.clientes.forEach(cliente => {
       cliente.sharedKey = cliente.nombre.toUpperCase().substring(0,1) + cliente.apellido.toUpperCase();
       console.log("Shared key: " + cliente.sharedKey);
    });
  }

  /**
   * Searchs shared key
   */
  public searchSharedKey() {
    this.clientes.filter(cliente => cliente.sharedKey = this.sharedKey);
  }

  /**
   * Deletes clientes
   * @param cliente 
   */
  delete(cliente: Cliente): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.clienteService.delete(cliente.id).subscribe(
          () => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }

}
