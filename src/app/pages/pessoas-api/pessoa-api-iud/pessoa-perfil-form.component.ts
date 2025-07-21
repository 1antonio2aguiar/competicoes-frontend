import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

import { PessoaApiService } from '../pessoa-api.service';
import { PessoaApiIn } from '../../../shared/models/pessoaApiIn';
import { TiposPessoasService } from '../../../services/tipos-pessoas/TiposPessoasService';
import { TipoPessoa } from '../../../shared/models/tipoPessoa';
import { PessoaApiOut } from '../../../shared/models/pessoaApiOut';

import * as moment from 'moment';
import { PessoaContextService } from '../../../services/logradouros/pessoa-context.service';

interface SituacaoOpcao {
  valor: string | number;
  descricao: string;
}

@Component({
  selector: 'ngx-pessoa-perfil-form',
  templateUrl: './pessoa-perfil-form.component.html',
  styleUrls: ['./pessoa-perfil-form.component.scss'] // Se tiver estilos específicos
})

export class PessoaPerfilFormComponent implements OnInit, OnDestroy {

  @ViewChild('cpfInput') cpfInputRef!: ElementRef<HTMLInputElement>;

  modoEdicao = false;
  pessoaId: number | null = null;
  pessoaNome: string | null = null;
  
  dataNascimentoDisplay: string | null = null;

  pessoaForm!: FormGroup;
  isLoading = false;
  isLoadingDados = false;
  private destroy$ = new Subject<void>();

  tiposPessoas: TipoPessoa[] = [];
  situacoes: SituacaoOpcao[] = [
    { valor: 0, descricao: 'ATIVO' },
    { valor: 1, descricao: 'INATIVO' },
    { valor: 2, descricao: 'BLOQUEADO' }
  ];

  // Header do card pode ser fixo ou passado via Input se necessário
  cardHeaderTitle = 'Dados do Perfil';

  constructor(
    private fb: FormBuilder,
    private pessoaApiService: PessoaApiService,
    private tipoPessoaService: TiposPessoasService,
    private route: ActivatedRoute, 
    private router: Router,
    private toastrService: NbToastrService,
    private pessoaContextService: PessoaContextService
  ) {
  }

  ngOnInit(): void {
    this.carregarTiposPessoas();
    this.initForm(); // Inicializar o formulário primeiro
    this.pessoaNome = this.pessoaContextService.getCurrentPessoaNome();

    // Obter o pessoaId da rota PAI (PessoaApiIudComponent)
    this.route.parent?.params.pipe(takeUntil(this.destroy$)).subscribe(parentParams => {
      
      if (parentParams['id']) {
        this.modoEdicao = true;
        this.pessoaId = +parentParams['id'];
        this.cardHeaderTitle = `Editando Perfil (${this.pessoaNome})`;
        // ---- CHAMADA PARA CARREGAR DADOS EM MODO EDIÇÃO ----
        this.carregarDadosPessoaParaEdicao(this.pessoaId);
        // -----------------------------------------------------
      } else {
        this.modoEdicao = false;
        this.pessoaId = null;
        this.cardHeaderTitle = 'Cadastrar Novo Perfil';
      }
    });

    this.pessoaForm.get('cpf')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      const control = this.pessoaForm.get('cpf');
      if (control && value && /[^\d]/.test(value)) { 
        const onlyDigits = value.replace(/\D/g, '');
        control.setValue(onlyDigits, { emitEvent: false, onlySelf: true });
      }
    });
  
  }

  initForm(): void { 

    this.pessoaForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      fisicaJuridica: ['F', Validators.required],
      situacao: [this.situacoes[0].valor, Validators.required],
      tipoPessoaId: [null, Validators.required], // Corrigido de tipoPessoa para tipoPessoaId

      // Campos Pessoa Física
      cpf: [''], 
      sexo: [null],
      estadoCivil: [null],
      dataNascimento: [],
      nomeMae: [''],
      nomePai: [''],
      observacao: [''],

      // Campos Pessoa Jurídica
      cnpj: [''],
      nomeFantasia: [''],
      objetoSocial: [''],
      microEmpresa: [false],
      tipoEmpresa: [null]
    });
  }

  // --- NOVO MÉTODO PARA CARREGAR DADOS DA PESSOA ---
  carregarDadosPessoaParaEdicao(id: number): void {
    //this.isLoadingDados = false; 
    let dataParaFormulario = null;

    this.pessoaApiService.getPessoaById(id)
      .then((pessoa: PessoaApiOut) => {

        dataParaFormulario = new Date(pessoa.dataNascimento);

        let cpfFormatadoParaDisplay = pessoa.cpf; // Assume que pessoa.cpf vem só com dígitos
        if (pessoa.cpf && pessoa.cpf.length === 11) {
          cpfFormatadoParaDisplay = this.formatarCpfParaDisplay(pessoa.cpf);
        }
        
        this.pessoaForm.patchValue({
          ...pessoa, // Espalha todas as propriedades que batem com os formControls
          dataNascimento: dataParaFormulario,
          estadoCivil: pessoa.estadoCivilId,
        });

        if (this.cpfInputRef && this.cpfInputRef.nativeElement && cpfFormatadoParaDisplay) {
          setTimeout(() => {
            this.cpfInputRef.nativeElement.value = cpfFormatadoParaDisplay;
          }, 0);
        }

        // Isso aqui é para pegar o nome nas telas de cadastro de endereços e outros
        // this.pessoaContextService.setNomePessoaAtual(pessoa.nome); 
      })
      .catch(error => {
        console.error(`Erro ao carregar dados da pessoa com ID ${id}:`, error);
      })
      .finally(() => {
        this.isLoadingDados = false; 
      });
  }
  // -------------------------------------------------

  carregarTiposPessoas() {
    this.tipoPessoaService.listAll()
      .then(tipos => {
        this.tiposPessoas = tipos; // Atribuição continua aqui
      })
      .catch(error => {
        console.error("Erro ao carregar tipos pessoas:", error);
    });
  }

  isPessoaFisica(): boolean { return this.pessoaForm.get('fisicaJuridica')?.value === 'F'; }
  isPessoaJuridica(): boolean { return this.pessoaForm.get('fisicaJuridica')?.value === 'J'; }

  onSubmit(): void {
    //this.isLoading = false;
    const dadosFormulario = this.pessoaForm.value;
    
    const pessoaParaSalvar: PessoaApiIn = { /* ... lógica de mapeamento ... */
      ...dadosFormulario,
      
      ...(this.isPessoaFisica() && {
        cnpj: null, nomeFantasia: null, objetoSocial: null, microEmpresa: null, tipoEmpresa: null,
      }),
      ...(this.isPessoaJuridica() && {
        cpf: null, sexo: null, estadoCivil: null, dataNascimento: null, nomeMae: null, nomePai: null,
      }),
    };

    if (this.modoEdicao && this.pessoaId) {
      // ATUALIZAR
      this.pessoaApiService.update(pessoaParaSalvar).pipe( // Passa o objeto completo com o ID
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (pessoaAtualizada: PessoaApiOut) => { // Espera um PessoaApiOut
          this.pessoaContextService.setPessoaNome(pessoaAtualizada.nome);
          
          //  Recarrega os dados no formulário
          let dataNascimentoFormatada: Date | null = null;
          if (pessoaAtualizada.dataNascimento) {
             const parts = pessoaAtualizada.dataNascimento.split('-');
             if (parts.length === 3) {
                 dataNascimentoFormatada = new Date(parseInt(parts[0],10), parseInt(parts[1],10) - 1, parseInt(parts[2],10));
             }
           }

          let cpfFormatadoParaDisplay = pessoaAtualizada.cpf; // Assume que pessoa.cpf vem só com dígitos
          if (pessoaAtualizada.cpf && pessoaAtualizada.cpf.length === 11) {
            cpfFormatadoParaDisplay = this.formatarCpfParaDisplay(pessoaAtualizada.cpf);
          }

          this.pessoaForm.patchValue({
            ...pessoaAtualizada,
            dataNascimento: dataNascimentoFormatada
          });

          if (this.cpfInputRef && this.cpfInputRef.nativeElement && cpfFormatadoParaDisplay) {
            setTimeout(() => {
              this.cpfInputRef.nativeElement.value = cpfFormatadoParaDisplay;
            }, 0);
          }

          this.showToast('Pessoa atualizada com sucesso!', 'Sucesso', 'success');
        },
        error: (erro) => {
          console.error('Erro ao atualizar pessoa:', erro);
          const mensagemErro = erro.error?.message || erro.message || 'Erro desconhecido ao atualizar pessoa.';
          this.toastrService.danger(mensagemErro, 'Falha na Atualização');
        }
      });
      // --- FIM DA IMPLEMENTAÇÃO DA ATUALIZAÇÃO ---
    } else {

        this.pessoaApiService.create(pessoaParaSalvar).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false) 
      ).subscribe({
        next: (pessoaCadastrada: PessoaApiOut) => { // Espera um PessoaApiOut
          this.pessoaId = pessoaCadastrada.id;
          console.log('Pessoa cadastrada com ID:', this.pessoaId);
          this.showToast('Pessoa inserida com sucesso!', 'Sucesso', 'success');

          // Atualizar o contexto com os dados da nova pessoa
          if (pessoaCadastrada.id) { // Verifica se o ID foi retornado
            this.pessoaContextService.setPessoaId(pessoaCadastrada.id);
          }
          this.pessoaContextService.setPessoaNome(pessoaCadastrada.nome);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar pessoa:', erro);
          // Tratar erros específicos do backend se necessário
          const mensagemErro = erro.error?.message || erro.message || 'Erro desconhecido ao cadastrar pessoa.';
          this.toastrService.danger(mensagemErro, 'Falha no Cadastro');
        }
      });
      // --- FIM DA IMPLEMENTAÇÃO DO CADASTRO ---

    }
  } 

  formatarCpfParaDisplay(cpfNumeros: string): string {
    if (!cpfNumeros || cpfNumeros.length !== 11) {
      return cpfNumeros; // Retorna original se não for um CPF válido para formatação
    }
    return `${cpfNumeros.substring(0, 3)}.${cpfNumeros.substring(3, 6)}.${cpfNumeros.substring(6, 9)}-${cpfNumeros.substring(9, 11)}`;
  }

  onCpfInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    let originalCursorPos = inputElement.selectionStart;

    // 1. Remove tudo que não for dígito
    let rawValue = value.replace(/\D/g, '');

    // 2. Limita a 11 dígitos
    if (rawValue.length > 11) {
      rawValue = rawValue.substring(0, 11);
    }

    // 3. Aplica a formatação
    let formattedValue = '';
    if (rawValue.length > 0) {
      formattedValue = rawValue.substring(0, 3);
    }
    if (rawValue.length > 3) {
      formattedValue += '.' + rawValue.substring(3, 6);
    }
    if (rawValue.length > 6) {
      formattedValue += '.' + rawValue.substring(6, 9);
    }
    if (rawValue.length > 9) {
      formattedValue += '-' + rawValue.substring(9, 11);
    }

    if (this.pessoaForm.get('cpf')?.value !== rawValue) {
        this.pessoaForm.get('cpf')?.setValue(rawValue, { emitEvent: false });
    }

    // 5. Atualiza o valor no elemento input (o que o usuário vê)
    inputElement.value = formattedValue;

    if (originalCursorPos !== null) {
        let newCursorPos = originalCursorPos;
        // Conta quantos caracteres de formatação foram adicionados ANTES da posição original do cursor
        let oldCharsBeforeCursor = (value.substring(0, originalCursorPos).match(/[\.\-]/g) || []).length;
        let newCharsBeforeCursor = (formattedValue.substring(0, originalCursorPos + (formattedValue.length - value.length) + 1 ).match(/[\.\-]/g) || []).length;

        // Ajuste simples: se o comprimento mudou, tenta ajustar
        if (value.length !== formattedValue.length) {
            // Se o caractere digitado não foi um ponto ou traço (caso o usuário tente digitar)
            // e resultou em um dígito sendo adicionado ao rawValue
            if (value.charAt(originalCursorPos -1) !== '.' && value.charAt(originalCursorPos -1) !== '-') {
                 newCursorPos = originalCursorPos + (newCharsBeforeCursor - oldCharsBeforeCursor) ;
            }

            // Se um caractere de formatação foi adicionado exatamente onde o cursor estava ou antes
             if ((rawValue.length === 3 || rawValue.length === 6 || rawValue.length === 9) &&
                 (formattedValue.length > value.length) ) { // Adicionou . ou -
                 // Se o último caractere digitado resultou na adição de um formatador
                 if (originalCursorPos === formattedValue.lastIndexOf('.') || originalCursorPos === formattedValue.lastIndexOf('-') ) {
                    newCursorPos++;
                 }
             }
        }
         // Garante que o cursor não ultrapasse o limite
        newCursorPos = Math.min(newCursorPos, formattedValue.length);
        // Evita que o cursor vá para uma posição negativa caso a deleção remova o primeiro char.
        newCursorPos = Math.max(newCursorPos, 0);

        try {
          inputElement.setSelectionRange(newCursorPos, newCursorPos);
        } catch (e) {
          // Ignora erros em browsers que não suportam ou em inputs 'number' (embora o seu seja text)
        }
    }
  }    

  onCancelar(): void {
    // Volta para a pesquisa geral de pessoas
    this.router.navigate(['/pages/pessoas-api/pessoa-api-pesquisa']);
  }

  getControl(name: string): AbstractControl | null { return this.pessoaForm.get(name); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showToast(message: string, title: string, status: 'success' | 'danger' | 'warning' | 'info'): void {
    this.toastrService.show(message, title, {
      status,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      duration: 3000
    });
  }
}