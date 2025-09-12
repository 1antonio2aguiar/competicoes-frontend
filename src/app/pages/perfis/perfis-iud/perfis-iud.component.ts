import { Component, OnInit, } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Filters } from '../../../shared/filters/filters';
import { LocalDataSource } from 'ng2-smart-table';

import { ConfirmationDialogComponent } from '../../components/confirm-delete/confirmation-dialog/confirmation-dialog.component';
import { PerfisService } from '../perfis.service';


@Component({
  selector: 'ngx-perfis-iud',
  templateUrl: './perfis-iud.component.html',
  styleUrls: ['./perfis-iud.component.scss']
})

export class PerfisIudComponent implements OnInit{
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();

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
        width: '24px',
      },
      nome: {
        title: 'Nome',
        type: 'string',
        width: '900px',
        filter: true
      },
    }
  };

  ngOnInit(): void {
    this.listar();
  }

  constructor(
    private service: PerfisService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) { }
  
  listar() {
    this.service.pesquisar(this.filtro)
      .then(response => {
        const perfis = response.perfis;
        this.source.load(perfis);
      })
      .catch(error => {
        console.error("Erro ao listar perfis:", error);
    });
  }

  onCreateConfirm(event) {

    this.service.create(event.newData)
      .subscribe(
        () => {
          this.listar();
          event.confirm.resolve();

          this.toastrService.show(
            'Nova perfil cadastradao com sucesso!',
            'Cadastro Realizado',
          { status: 'success', icon: 'checkmark-circle-outline' }
        );
        },
        error => console.error('Erro ao criar perfil:', error)
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
            `Perfil "${event.newData.nome}" foi atualizado com sucesso!`,
            'Atualização Realizada',
            { status: 'success', icon: 'edit-outline' }
          );
        },
        error => console.error('Erro ao editar perfil:', error)
    );
  }

  onDeleteConfirm(event): void {
    const perfilParaExcluir = event.data;
    
    // Abre o componente de diálogo reutilizável
    this.dialogService.open(ConfirmationDialogComponent, {
      context: {
        title: 'Confirmar Exclusão',
        // Mensagem dinâmica para melhorar a experiência do usuário
        message: `Você tem certeza que deseja excluir o perfil <strong>"${perfilParaExcluir.nome}"</strong>?`,
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
        this.service.delete(perfilParaExcluir.id)
          .subscribe({
            next: () => {
              // Atualiza a tabela com os dados mais recentes
              this.listar();
              event.confirm.resolve(); // Notifica a ng2-smart-table que a operação foi bem-sucedida

              // Dispara o toast de sucesso
              this.toastrService.show(
                `Perfil "${perfilParaExcluir.nome}" foi excluído com sucesso.`,
                'Exclusão Realizada',
                { status: 'success', icon: 'trash-2-outline' }
              );
            },
            error: (error) => {
              console.error('Erro ao deletar perfil:', error);
              event.confirm.reject(); // Notifica a ng2-smart-table que a operação falhou

              // Dispara o toast de erro
              this.toastrService.show(
                'Não foi possível excluir o perfil. Verifique se ele não está sendo usado em outras partes do sistema.',
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
