// src/app/pages/usuarios/usuarios-iud/usuarios-iud.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef, NbToastrService, NbToastrConfig } from '@nebular/theme';


import { Filters } from '../../../shared/filters/filters';
import { Usuario } from '../../../shared/models/usuario';
import { UsuariosService } from '../usuarios.service';
import { Empresa } from '../../../shared/models/empresa';
import { Perfil } from '../../../shared/models/perfil';
import { AuthService } from '../../../shared/services/auth.service'; // Seu AuthService atualizado

@Component({
  selector: 'ngx-usuarios-iud',
  templateUrl: './usuarios-iud.component.html',
  styleUrls: ['./usuarios-iud.component.scss']
})

export class UsuariosIudComponent implements OnInit {
  usuarioId: number = 0;
  width = 700; // Define a largura do modal
  @Input() mode: 'add' | 'edit';

  usuarioForm: FormGroup;
  filtro: Filters = new Filters();
  @Input() usuario: Usuario | undefined;

  empresas: Empresa[] = []; // Lista de empresas para o select
  perfis: Perfil[] = [];     // Lista de perfis para seleção
  selectedPerfis: number[] = []; // IDs dos perfis selecionados

  loggedUserCompanyId: number | null = null;
  loggedUserCompanyName: string | null = null;
  loggedUserUsuaryName: string | null = null;


  constructor(
    private usuarioService: UsuariosService,
    private formBuilder: FormBuilder,
    private ref1: NbWindowRef,
    private toastrService: NbToastrService,
    private authService: AuthService
  ) {
    this.filtro.pagina = 1;
    this.filtro.itensPorPagina = 10;
  }

  async ngOnInit() {
    // Obter dados da empresa do usuário logado
    this.loggedUserCompanyId = this.authService.getEmpresaId();
    this.loggedUserUsuaryName = this.authService.getUserName();
    this.loggedUserCompanyName = this.authService.getCompanyName();

    this.criarFormulario();
    await this.loadDependencies(); // Carregar empresas e perfis

    if (this.mode === 'add') {
      // Se for cadastro, pré-selecionar a empresa do usuário logado
      if (this.loggedUserCompanyId) {
        this.usuarioForm.get('empresaId')?.setValue(this.loggedUserCompanyId);
        this.usuarioForm.get('empresaId')?.disable(); // Desabilita o campo para que não possa ser alterado no cadastro
      }
    } else if (this.mode === 'edit' && this.usuario) {
      // No modo de edição, a empresa não pode ser alterada.
      this.usuarioForm.get('empresaId')?.disable();

      this.usuarioForm.patchValue(this.usuario);

      // Preencher o ID da empresa para o select
      if (this.usuario.empresa) {
        this.usuarioForm.get('empresaId')?.setValue(this.usuario.empresa.id);
      }

      // Preencher os perfis do usuário para o controle de seleção
      // *** AQUI ESTÁ A CORREÇÃO PRINCIPAL ***
      if (this.usuario.perfis && this.usuario.perfis.length > 0 && this.perfis.length > 0) {
        this.selectedPerfis = []; // Limpa o array antes de preencher
        // Itera sobre os nomes de perfis do usuário
        (this.usuario.perfis as unknown as string[]).forEach(perfilNomeUsuario => {
          // Encontra o objeto Perfil correspondente na lista completa de perfis
          const perfilEncontrado = this.perfis.find(p => p.nome === perfilNomeUsuario);
          if (perfilEncontrado && perfilEncontrado.id) {
            this.selectedPerfis.push(perfilEncontrado.id);
          }
        });
        // Define o valor do formControl `perfisIds` com os IDs mapeados
        this.usuarioForm.get('perfisIds')?.setValue(this.selectedPerfis);
      }

      // Remover validadores da senha no modo de edição, já que o campo não será exibido.
      this.usuarioForm.get('senha')?.clearValidators();
      this.usuarioForm.get('senha')?.updateValueAndValidity();
    }
  }

  async loadDependencies() {
    try {
      this.empresas = await this.usuarioService.getEmpresas();

      // No modo de adição, se o ID da empresa logada existir e não estiver na lista, adicioná-la (caso não seja carregada)
      // Isso garante que a opção da empresa logada esteja no <nb-select> mesmo que ela não venha da lista completa.
      if (this.mode === 'add' && this.loggedUserCompanyId && !this.empresas.some(e => e.id === this.loggedUserCompanyId)) {
        this.empresas.push({ id: this.loggedUserCompanyId, razaoSocial: this.loggedUserCompanyName || 'Empresa Logada' } as Empresa);
      } else if (this.mode === 'edit' && this.usuario?.empresa?.id && !this.empresas.some(e => e.id === this.usuario?.empresa?.id)) {
        // No modo de edição, se a empresa do usuário não estiver na lista de empresas carregadas, adicione-a.
        // Isso é importante caso a empresa do usuário editado não esteja ativa ou não apareça na lista geral.
        this.empresas.push(this.usuario.empresa);
      }


      this.perfis = await this.usuarioService.getPerfis();
    } catch (error) {
      this.showToast('Erro ao carregar empresas e perfis.', 'danger');
      console.error('Erro ao carregar dependências:', error);
    }
  }

  criarFormulario() {
    this.usuarioForm = this.formBuilder.group({
      id: [null],
      empresaId: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      // Senha é obrigatória no ADD, mas condicional na edição
      senha: [null, [Validators.required, Validators.minLength(6)]],
      nome: [null, [Validators.required]],
      ativo: [true],
      perfisIds: [[]]
    });
  }

  onPerfilChange(event: any, perfilId: number | undefined) {
    if (perfilId === undefined || perfilId === null) {
      console.warn('ID do perfil é inválido.', perfilId);
      return;
    }

    const idAsNumber = perfilId as number;
    if (event.checked) {
      if (!this.selectedPerfis.includes(idAsNumber)) {
        this.selectedPerfis.push(idAsNumber);
      }
    } else {
      this.selectedPerfis = this.selectedPerfis.filter(id => id !== idAsNumber);
    }
    // Sempre atualiza o valor do formControl `perfisIds` para refletir a seleção
    this.usuarioForm.get('perfisIds')?.setValue(this.selectedPerfis);
  }

  onSubmit() {
    const formRawValue = this.usuarioForm.getRawValue();

    console.log('formRawValue ', formRawValue);

    // No modo de edição, removemos a senha do payload SE E SOMENTE SE
    // o campo de senha não foi preenchido/alterado pelo usuário.
    if (this.mode === 'edit' && !formRawValue.senha) {
      delete formRawValue.senha;
    }

    // Se o formulário for inválido (e não for um campo desabilitado ou senha vazia em edit),
    // marca os campos como tocados e exibe a mensagem.
    if (!this.usuarioForm.valid && (this.mode === 'add' || (this.mode === 'edit' && formRawValue.senha))) {
      this.markFormGroupTouched(this.usuarioForm);
      this.showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'warning');
      return; // Impede o envio do formulário inválido
    }

    const usuarioParaSalvar: Usuario = {
      ...formRawValue,
      perfisIds: this.selectedPerfis
    };

    if (this.mode === 'add') {
      this.usuarioService.create(usuarioParaSalvar).subscribe(
        (response) => {
          this.showToast('Usuário cadastrado com sucesso!', 'success');
          this.fecharJanelaModal('save');
        },
        (error) => {
          this.showToast('Erro ao cadastrar usuário!', 'danger');
          console.error('Erro ao cadastrar usuário:', error);
        }
      );
    } else if (this.mode === 'edit') {
      this.usuarioService.update(usuarioParaSalvar).subscribe(
        (response) => {
          this.showToast('Usuário atualizado com sucesso!', 'success');
          this.fecharJanelaModal('updated');
        },
        (error) => {
          this.showToast('Erro ao atualizar usuário!', 'danger');
          console.error('Erro ao atualizar usuário:', error);
        }
      );
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  fecharJanelaModal(reason: string = '') {
    this.ref1.close(reason);
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