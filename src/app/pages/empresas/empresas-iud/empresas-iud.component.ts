import { Component, OnInit, } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Filters } from '../../../shared/filters/filters';
import { LocalDataSource } from 'ng2-smart-table';

import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';
import { EmpresasService } from '../empresas.service';
import { CnpjPipe } from '../../../shared/pipes/cnpj.pipe';
import { TelefonePipe } from '../../../shared/pipes/telefone.pipe';

@Component({
  selector: 'ngx-empresas-iud',
  templateUrl: './empresas-iud.component.html',
  styleUrls: ['./empresas-iud.component.scss']
})

export class EmpresasIudComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();
  private cnpjPipeInstance = new CnpjPipe();
  private foneInstance = new TelefonePipe();

  public settings = {
    pager: {
      perPage: this.filtro.itensPorPagina, // Define o número de linhas por página
      display: true, // Exibe o paginador
    },

    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
      width: '40px',
      addMode: 'edit',
    },

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
      addMode: 'edit',
      mode: 'inline',
    },

    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },

    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
        addable: false,
        filter: true,
        width: '20px',
      },
      razaoSocial: {
        title: 'Razão Social',
        type: 'string',
        width: '500px',
        filter: true
      },
      atividade: {
        title: 'Atividade',
        type: 'string',
        width: '300px',
        filter: false
      },
      cnpj: {
        title: 'CNPJ',
        type: 'string',
        width: '200px',
        valuePrepareFunction: (cell: any, row: any) => {
          return this.cnpjPipeInstance.transform(row.cnpj);
        },
        filter: false, 
        filterFunction: false,
      },
      telefone: {
        title: 'Telefone',
        type: 'string',
        width: '170px',
        filter: false,
        valuePrepareFunction: (cell: any, row: any) => {
          // Primeiro, verifica se o campo 'telefone' existe e não está vazio para evitar erros
          if (!row.telefone) {
            return ''; // Retorna vazio se não houver telefone
          }

          // Remove qualquer caractere que não seja dígito para ter uma contagem limpa
          const apenasDigitos = row.telefone.toString().replace(/\D/g, '');

          // Agora, fazemos a verificação do tamanho
          if (apenasDigitos.length <= 10) {
            // Se tiver 10 ou menos dígitos (telefone fixo)
            return this.foneInstance.transform(apenasDigitos, 0); // Passa o '0' como primeiro parâmetro
          } else {
            // Se tiver 11 ou mais dígitos (celular)
            return this.foneInstance.transform(apenasDigitos, 1); // Passa o '1' como primeiro parâmetro
          }
        }
      },
      inscricaoEstadual: {
        title: 'Inscrição',
        type: 'string',
        width: '100px',
        filter: false
      },
    },
  };

  ngOnInit(): void {
    this.listar();
  }

  constructor(
    private service: EmpresasService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) { }

  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const empresas = response.empresas;
        this.source.load(empresas);
      })
      .catch(error => {
        console.error("Erro ao listar empresas:", error);
    });
  }
  
  onCreateConfirm(event) {

    this.service.create(event.newData)
      .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          this.toastrService.show(
            'Nova empresa cadastrada com sucesso!',
            'Cadastro Realizado',
          { status: 'success', icon: 'checkmark-circle-outline' }
        );
        },
        error => console.error('Erro ao criar empresa:', error)
    );
  }

  onSaveConfirm(event) {

    this.service.update(event.newData)
    .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          // <<< TOAST DE SUCESSO PARA ATUALIZAÇÃO >>>
          this.toastrService.show(
            `Empresa "${event.newData.razaoSocial}" foi atualizada com sucesso!`,
            'Atualização Realizada',
            { status: 'success', icon: 'edit-outline' }
          );
        },
        error => console.error('Erro ao editar empresa:', error)
    );
  }

  onDeleteConfirm(event): void {
    const empresaParaExcluir = event.data;
    
    // Abre o componente de diálogo reutilizável
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Confirmar Exclusão',
        // Mensagem dinâmica para melhorar a experiência do usuário
        message: `Você tem certeza que deseja excluir a empresa <strong>"${empresaParaExcluir.razaoSocial}"</strong>?`,
        confirmButtonText: 'Sim, Excluir',
        cancelButtonText: 'Cancelar',
        status: 'danger',
        icon: 'trash-2-outline'
      },
      closeOnBackdropClick: false // Impede que o diálogo feche ao clicar fora
    }).onClose.subscribe(confirmado => {
      // 'confirmado' será true se o usuário clicar em "Sim, Excluir"
      if (confirmado) {
        // Se confirmado, executa a lógica de exclusão
        this.service.delete(empresaParaExcluir.id)
          .subscribe({
            next: () => {
              // Atualiza a tabela com os dados mais recentes
              this.listar();
              event.confirm.resolve(); // Notifica a ng2-smart-table que a operação foi bem-sucedida

              // Dispara o toast de sucesso
              this.toastrService.show(
                `Empresa "${empresaParaExcluir.razaoSocial}" foi excluída com sucesso.`,
                'Exclusão Realizada',
                { status: 'success', icon: 'trash-2-outline' }
              );
            },
            error: (error) => {
              console.error('Erro ao deletar empresa:', error);
              event.confirm.reject(); // Notifica a ng2-smart-table que a operação falhou

              // Dispara o toast de erro
              this.toastrService.show(
                'Não foi possível excluir o empresa. Verifique se ele não está sendo usado em outras partes do sistema.',
                'Erro na Exclusão',
                { status: 'danger', icon: 'alert-circle-outline' }
              );
            }
          });
      } else {
        // Se o usuário clicou em "Cancelar" ou fechou o diálogo
        console.log('Usuário cancelou a exclusão.');
        event.confirm.reject(); // Notifica a ng2-smart-table que a operação foi cancelada
      }
    });
  }
}
 