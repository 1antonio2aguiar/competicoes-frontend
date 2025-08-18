import { NgModule } from '@angular/core';

import { TelefonePipe } from './pipes/telefone.pipe';
import { CnpjPipe } from './pipes/cnpj.pipe';
import { CpfPipe } from './pipes/cpf.pipe';
import { SexoPipe } from './pipes/sexo.pipe';
import { SimNaoPipe } from './pipes/sim-nao.pipe';
import { Cep } from './pipes/cep.pipe';

@NgModule({
  declarations: [
  TelefonePipe,
  CpfPipe,
  CnpjPipe,
  SexoPipe,
  SimNaoPipe,
  Cep

  ],
  imports: [
    
  ],
  exports: [
    TelefonePipe,
    CpfPipe,
    CnpjPipe,
    SexoPipe,
    SimNaoPipe,
    Cep,


  ]
})
export class MeuSharedModule { }
