import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService, NbWindowControlButtonsConfig, NbWindowService, NbToastrConfig } from '@nebular/theme';

import { Filters } from '../../../shared/filters/filters';
import { UsuariosService } from '../usuarios.service';
import { UsuariosIudComponent } from '../usuarios-iud/usuarios-iud.component';
import { Usuario } from '../../../shared/models/usuario';
import { ConfirmDeleteComponent } from '../../components/confirm-delete/confirm-delete-modal.component';

@Component({
  selector: 'ngx-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.scss']
})

export class UsuariosPesquisaComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  filtro: Filters = new Filters();

  public settings = {
    mode: 'external',

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
        width: '30px',
        filter: true,
      },

      nome: {
        title: 'Nome',
        type: 'string',
      },

      email: {
        title: 'Email',
        type: 'string',
        filter: true,
      },

      ativo: {
        title: 'Ativo',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => {
          return value ? 'Sim' : 'Não'; // Exibe "Sim" ou "Não"
        },
      },
    }
  }

  ngOnInit(): void {
    this.listar();
  }

  constructor(
    private usuariosService: UsuariosService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private windowService: NbWindowService,
  ) {

  }

  listar() {
    this.usuariosService.pesquisar(this.filtro)
      .then(response => {
        const usuarios = response.usuarios;
        this.source.load(usuarios);
      });
  }

  onCreateConfirm() {
    this.abrirModalAddUsuario();
  }

  async abrirModalAddUsuario() {
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: true,
      close: true
    };

    this.windowService.open(UsuariosIudComponent, {
      title: `Cadastrar Usuario`,
      buttons: buttonsConfig,
      context: { mode: 'add' }
    }).onClose.subscribe((reason: string | undefined) => {
      if (reason === 'atualizado' || reason === 'save') {
        this.listar();
        this.showToast('Usuário cadastrado com sucesso!', 'success');
      }
    });
  }

  onSaveConfirm(event) {
    this.abrirModalEditarUsuario(event.data.id); 
  }

  async abrirModalEditarUsuario(id: number) {
      try {
        const usuarioCompleto: Usuario = await this.usuariosService.getUsuarioById(id);

        console.log('usuario completa ', usuarioCompleto)

        const buttonsConfig: NbWindowControlButtonsConfig = {
          minimize: false,
          maximize: false,
          fullScreen: true,
          close: true
        };
  
        this.windowService.open(UsuariosIudComponent, {
          title: `Editar Usuario`,
          buttons: buttonsConfig,
          context: { usuario: usuarioCompleto, mode: 'edit' }
        }).onClose.subscribe((reason: string | undefined) => {
          if (reason === 'atualizado' || reason === 'save') {
            this.listar();
            this.showToast('uUuario alterada com sucesso!', 'success');
          }
        });
      } catch (error) {
        this.showToast('ERRO ao tentar alterar usuario!', 'danger');
        console.error("Erro ao buscar usuario por ID:", error);
        // Trate o erro adequadamente
    }
  }

  onDeleteConfirm(event): void {
    console.log('ja vai');
    this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Excluir Usuário',
        message: `Tem certeza que deseja excluir o usuario  ${event.data.id}?`,
        data: event.data
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.usuariosService.delete(event.data.id).subscribe(() => {
          this.listar();
          this.showToast('Usuário excluído com sucesso!', 'success');
        },
          (error) => {
            this.showToast('Erro ao excluir Usuário!', 'danger');  // Adicionado o toast de erro
            console.error("Erro ao excluir Usuário:", error);
          });
      }
    });
  }

  
  showToast(message: string, status: string) {
    const config: Partial<NbToastrConfig> = {
      status: status,
      duration: 3000,
      preventDuplicates: true,
    };
    this.toastrService.show(message, '', config);
  }
}
