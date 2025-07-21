import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelaOrigemService {
  telaOrigem: string = ''; // Inicializa com uma string vazia ou um valor padrão

  setTelaOrigem(tela: string) {
    this.telaOrigem = tela;
  }

  getTelaOrigem(): string {
    return this.telaOrigem;
  }
}