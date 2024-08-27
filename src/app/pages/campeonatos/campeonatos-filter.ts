import { HttpParams } from '@angular/common/http';

export class CampeonatosFiltro {
    pagina = 0;
    itensPorPagina = 10;
    totalRegistros = 0;
    params = new HttpParams();
}