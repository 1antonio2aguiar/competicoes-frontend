import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Adicionar OnDestroy
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService  } from '@nebular/theme';
import { Observable, of, Subject } from 'rxjs'; // Importar Subject
import { CepService } from '../../../../services/ceps/CepService';
import { CepApiOut } from '../../../../shared/models/cepApiOut';
import { EnderecoService } from '../endereco.service';
import { EnderecoIn } from '../../../../shared/models/enderecoIn';
import { EnderecoOut } from '../../../../shared/models/enderecoOut';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { TipoPLogradouro } from '../../../../shared/models/tipoLogradouro';
import { TiposLogradouroService } from '../../../../services/tipos-logradouros/TiposLogradouroService';
import { LogradouroService } from '../../../../services/logradouros/LogradouroService';
import { LogradouroPesquisaOut } from '../../../../shared/models/logradouroPesquisaOut';
import BairroOut from '../../../../shared/models/bairroOut';
import { CidadePesquisaOut } from '../../../../shared/models/cidadePesquisaOut';
import { CidadeService } from '../../../../services/cidades/CidadeService';
 
@Component({
  selector: 'ngx-endereco-iud',
  templateUrl: './endereco-iud.component.html',
  styleUrls: ['./endereco-iud.component.scss']
})

export class EnderecoIudComponent implements OnInit {

  @Input() enderecoParaEdicao: any;
  @Input() pessoaId: number | null = null; // Para associar o endereço à pessoa
  @Input() nomePessoa: string | null = null; // Para mostrar no cabeçalho do html

  isLoadingLogradouros = false;
  isLoadingCidades = false;

  logradourosPesquisa: LogradouroPesquisaOut[] = [];
  cidadesPesquisa: CidadePesquisaOut[] = [];

  tiposLogradouro: TipoPLogradouro[] = []; 
  bairros: BairroOut[] = []; 

  private destroy$ = new Subject<void>(); // Para desinscrição

  private cepId = 0;
  private logradouroId = 0;
  private cidadeId = 0;
  private bairroId = 0;

  enderecoForm!: FormGroup;
  modoEdicao = false;
  isLoadingCep = false;
  isLoadingSalvar = false;
  private isSelectingLogradouro = false;
  private isSelectingCidade = false;
  items: any;

  constructor(
    protected dialogRef: NbDialogRef<EnderecoIudComponent>,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private cepService: CepService, 
    private enderecoService: EnderecoService,
    private logradouroService: LogradouroService,
    private tiposLogradouroService: TiposLogradouroService,
    private cidadeService: CidadeService
  ) {}

  ngOnInit(): void {
    this.carregarTiposLogradouro();
    this.modoEdicao = !!this.enderecoParaEdicao;
    this.initForm();

    if (this.modoEdicao && this.enderecoParaEdicao) {
      let tipoEnderecoStringParaForm: string;
      if (this.enderecoParaEdicao.tipoEndereco === 0) {
        tipoEnderecoStringParaForm = 'CASA';
      } else if (this.enderecoParaEdicao.tipoEndereco === 1) {
        tipoEnderecoStringParaForm = 'TRABALHO';
      } else {
        tipoEnderecoStringParaForm = this.enderecoForm.get('tipoEndereco')?.value || 'CASA';
        if (this.enderecoParaEdicao.tipoEndereco !== undefined && this.enderecoParaEdicao.tipoEndereco !== null) {
          console.warn(`Valor de tipoEndereco não mapeado recebido na edição: ${this.enderecoParaEdicao.tipoEndereco}. Usando padrão.`);
        }
      }

      let cepFormatadoParaDisplay = this.enderecoParaEdicao.cep; // Assume que pode vir formatado ou não
      if (this.enderecoParaEdicao.cep && /^\d{8}$/.test(this.enderecoParaEdicao.cep)) { // Se for 8 dígitos
        cepFormatadoParaDisplay = this.formatarCepParaDisplay(this.enderecoParaEdicao.cep);
      }
      
      const { tipoEndereco, ...dadosRestantes } = this.enderecoParaEdicao;
      
      const dadosParaFormulario = {
        ...dadosRestantes,
        cep: cepFormatadoParaDisplay,
        tipoEndereco: tipoEnderecoStringParaForm ,// Usar o valor string mapeado
        tipoLogradouro: this.enderecoParaEdicao.tipoLogradouroId, 
      };

      // Aplica patchValue para os campos de nível superior
      this.enderecoForm.patchValue(dadosParaFormulario);

      const bairroControl = this.enderecoForm.get('bairros') as FormGroup;
      if (bairroControl) {
        if (this.enderecoParaEdicao.bairroId && this.enderecoParaEdicao.bairroNome) {
          // 1. Popula a lista de opções para o nb-select ter o que mostrar
          this.bairros = [{
            id: this.enderecoParaEdicao.bairroId,
            nome: this.enderecoParaEdicao.bairroNome,
          }];

          // 2. Define o ID do bairro no FormControl 'id'
          bairroControl.patchValue({
            id: this.enderecoParaEdicao.bairroId
          });
        } else {
          this.bairros = [];
          bairroControl.patchValue({ id: null });
        }
      }
    }

    this.setupLogradouroNomeListener();
    this.setupCidadeNomeListener();
  }

  carregarTiposLogradouro() {
    this.tiposLogradouroService.listAll()
      .then(tipos => {
        this.tiposLogradouro = tipos;
      })
      .catch(error => {
        console.error("Erro ao carregar tipos de logradouro:", error);
    });
  }
  
  formatarCepParaDisplay(cepNumeros: string): string {
    if (!cepNumeros || cepNumeros.length !== 8 || !/^\d+$/.test(cepNumeros)) {
      return cepNumeros; // Retorna original se não for 8 dígitos numéricos
    }
    return `${cepNumeros.substring(0, 2)}.${cepNumeros.substring(2, 5)}-${cepNumeros.substring(5, 8)}`;
  }

  initForm(): void {

    this.enderecoForm = this.fb.group({
      id: [null], // Usado para edição
      nomePessoa: [this.nomePessoa],
      //cep: ['', [Validators.required, Validators.pattern(/^\d{5}\d{3}$/)]],

      cep: ['', [
        Validators.required,
        Validators.pattern(/^(\d{8}|\d{2}\.\d{3}-\d{3})$/) 
      ]],

      logradouroNome: ['', Validators.required],
      tipoLogradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],

      bairros: 
        this.fb.group({
          id:[null]
      }),
      
      cidadeId: [4047],
      cidadeNome: ['UBERABA'],
      uf: ['MG'],
      tipoEndereco: ['CASA', Validators.required], // Valor padrão
      principal: ['S'],
      
      cepId:[null],
      logradouroId: [null]
    });
    
  }

  // EnderecoIudComponent.ts

// ... (injeção do NbToastrService no construtor como mostrado acima) ...

  buscarCep(): void {
    const cepControl = this.enderecoForm.get('cep');
    const cepValue = cepControl?.value;

    if (cepValue && cepControl?.valid) {
      this.isLoadingCep = true;

      // Limpar campos de endereço ANTES da busca, para que o usuário veja que algo está acontecendo
      // e não fique com dados antigos se a nova busca falhar.
      this.enderecoForm.patchValue({
        logradouroNome: '',
        tipoLogradouro: '',
        // Não limpe o CEP aqui, pois ele é a entrada da busca
        cidadeNome: '',
        uf: ''
      });
      (this.enderecoForm.get('bairros') as FormGroup).patchValue({ id: null, nome: null });
      this.cepId = 0;
      this.logradouroId = 0;
      this.bairroId = 0;


      // No seu serviço, o findByCep espera o CEP sem formatação
      const cepNumeros = cepValue.replace(/\D/g, ''); // Garante que estamos enviando apenas números

      this.cepService.findByCep(cepNumeros).subscribe({
        next: (dadosApi: CepApiOut) => {

          this.isLoadingCep = false; // Mover para cá para que o spinner pare APÓS o patch

          this.cepId        =  dadosApi.id || 0; // Usar || 0 para garantir que é um número
          this.logradouroId =  dadosApi.logradouroId || 0;
          if (dadosApi.bairros && dadosApi.bairros.length > 0) {
            this.bairroId     = dadosApi.bairros[0].id || 0;
          } else {
            this.bairroId = 0;
          }

          let cepFormatadoParaDisplay = dadosApi.cep;
          if (dadosApi.cep && /^\d{8}$/.test(dadosApi.cep)) {
            cepFormatadoParaDisplay = this.formatarCepParaDisplay(dadosApi.cep);
          }

          this.enderecoForm.patchValue({
            logradouroNome: dadosApi.logradouroNome,
            tipoLogradouro: dadosApi.tipoLogradouroId,
            cidadeNome: dadosApi.cidadeNome,
            uf: dadosApi.uf
          });
          
          if (dadosApi.bairros && dadosApi.bairros.length > 0) {
            this.bairros = dadosApi.bairros;
            const primeiroBairro = dadosApi.bairros[0];
            
            const bairroControl = this.enderecoForm.get('bairros') as FormGroup;
            bairroControl.patchValue({
              id: primeiroBairro.id
            });
            this.bairroId = primeiroBairro.id || 0;
          } else {
            this.bairros = []; 
            this.bairroId = 0;
          }
          this.isSelectingLogradouro = true;

        },
        error: (erroHttp) => { // erroHttp é geralmente um HttpErrorResponse
          this.isLoadingCep = false;
          this.bairros = [];
          console.error("Erro ao buscar CEP:", erroHttp);

          // Limpar os campos preenchidos automaticamente é uma boa prática em caso de erro
          this.enderecoForm.patchValue({
            logradouroNome: '',
            tipoLogradouro: '',
            cidadeNome: '',
            uf: ''
          });
          (this.enderecoForm.get('bairros') as FormGroup).patchValue({ id: null, nome: null });
          this.cepId = 0;
          this.logradouroId = 0;
          this.bairroId = 0;

          // Exibir mensagem de erro para o usuário
          let mensagemErroUsuario = 'Falha ao buscar dados do CEP. Tente novamente.';
          if (erroHttp.status === 404) {
            mensagemErroUsuario = `CEP "${cepValue}" não encontrado. Verifique o número digitado.`;
          } else if (erroHttp.status === 0 || erroHttp.status >= 500) {
            mensagemErroUsuario = `CEP "${cepValue}" não encontrado. Verifique o número digitado.`;
          }
          // ... outras verificações de status se necessário

          this.toastrService.show(
            mensagemErroUsuario,
            'CEP não cadastrado!',
            { status: 'danger', duration: 5000 } // 'danger' para erro, duração em ms
          );

          // Opcional: Marcar o campo CEP como inválido ou adicionar um erro específico a ele
          // cepControl?.setErrors({ 'cepNaoEncontrado': true });
        }
      });
    } else {
      // Se o CEP não for válido antes mesmo de chamar o serviço (ex: pattern não bate)
      if (cepValue && !cepControl?.valid) {
          this.toastrService.show(
              'Formato do CEP inválido. Use XXXXX-XXX ou XXXXXXXX.', // Ajuste a mensagem conforme seu pattern
              'CEP Inválido',
              { status: 'warning', duration: 4000 }
          );
      }
      // Não precisa fazer nada se o CEP estiver vazio, pois o Validators.required cuidará disso no submit.
    }
  }

  cancelar(): void {
    this.dialogRef.close(); // Fecha o modal sem retornar dados
  }

  salvar(): void {
    if (this.enderecoForm.invalid) {
      this.enderecoForm.markAllAsTouched();
      // Você pode querer mostrar uma notificação de erro aqui também
      // Ex: this.toastService.show('Formulário inválido. Verifique os campos.', 'Erro', { status: 'danger' });
      return;
    }

    this.isLoadingSalvar = true;
    const formValue = this.enderecoForm.getRawValue(); 
    
    // Mapear o valor do formulário para o tipo EnderecoIn
    const enderecoPayload: EnderecoIn = {
      id: null,
      cepId: this.cepId > 0 ? this.cepId : formValue.cepId,
      //cepId: formValue.cepId ,
      logradouroId: this.logradouroId > 0 ? this.logradouroId : formValue.logradouroId,
      //logradouroId: formValue.logradouroId ,
      bairroId: formValue.bairros?.id || null, 
      numero: formValue.numero,
      complemento: formValue.complemento || null, // Enviar null se o campo estiver vazio
      pessoaId: this.pessoaId,
      tipoEndereco: formValue.tipoEndereco === 'CASA' ? 0 : (formValue.tipoEndereco === 'TRABALHO' ? 1 : 0),
      principal: formValue.principal ? 'S' : 'N'
    };

    if (this.modoEdicao) {
      // Garantir que o ID está no payload para update
      if (enderecoPayload.id == null && this.enderecoParaEdicao?.id != null) {
        enderecoPayload.id = this.enderecoParaEdicao.id; // Garante que o ID original da edição seja usado
      }

      console.log('VALORES UPD ', enderecoPayload)

      this.enderecoService.update(enderecoPayload).subscribe({
        next: (enderecoAtualizado: EnderecoOut) => {
          this.isLoadingSalvar = false;
          console.log('Endereço atualizado com sucesso (componente):', enderecoAtualizado);
          this.dialogRef.close(enderecoAtualizado); // Retorna o EnderecoOut (resposta da API)
        },
        error: (err) => {
          this.isLoadingSalvar = false;
          console.error('Erro ao atualizar endereço:', err);
          // Ex: this.toastService.show('Falha ao atualizar endereço.', 'Erro', { status: 'danger' });
        }
      });
      
    } else { // Modo Criação
      this.enderecoService.create(enderecoPayload).subscribe({
        next: (novoEndereco: EnderecoOut) => {
          this.isLoadingSalvar = false;
          console.log('Endereço criado com sucesso (componente):', novoEndereco);
          this.dialogRef.close(novoEndereco); // Retorna o EnderecoOut (resposta da API)
          // Ex: this.toastService.show('Endereço cadastrado!', 'Sucesso', { status: 'success' });
        },
        error: (err) => {
          this.isLoadingSalvar = false;
          console.error('Erro ao criar endereço:', err);
          // Ex: this.toastService.show('Falha ao cadastrar endereço.', 'Erro', { status: 'danger' });
        }
      });
    }
  }

  // Colocar a mascara quando for digitando.
  onCepInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valorAnterior = inputElement.value; // Valor antes da formatação nesta chamada
    let posicaoCursorOriginal = inputElement.selectionStart;

    // 1. Remove tudo que não for dígito do valor atual do input
    let valorNumerico = inputElement.value.replace(/\D/g, '');

    // 2. Limita a 8 dígitos (2 + 3 + 3 = 8)
    if (valorNumerico.length > 8) {
      valorNumerico = valorNumerico.substring(0, 8);
    }

    // 3. Aplica a formatação XX.XXX-XXX
    let valorFormatado = '';
    if (valorNumerico.length > 0) {
      valorFormatado = valorNumerico.substring(0, Math.min(2, valorNumerico.length)); // Pega os primeiros 2 dígitos
    }
    if (valorNumerico.length > 2) {
      valorFormatado += '.' + valorNumerico.substring(2, Math.min(5, valorNumerico.length)); // Adiciona '.' e os próximos até 3 dígitos
    }
    if (valorNumerico.length > 5) {
      valorFormatado += '-' + valorNumerico.substring(5, Math.min(8, valorNumerico.length)); // Adiciona '-' e os últimos até 3 dígitos
    }

    // 4. Atualiza o FormControl do Angular (apenas com os números)
    // Isso garante que o valor do formulário seja sempre o CEP "cru" (só dígitos)
    // E emitEvent: false evita retriggering valueChanges se você tiver listeners
    if (this.enderecoForm.get('cep')?.value !== valorNumerico) {
      this.enderecoForm.get('cep')?.setValue(valorNumerico, { emitEvent: false });
    }

    // 5. Atualiza o valor no elemento input (o que o usuário vê)
    inputElement.value = valorFormatado;

    // 6. Tenta ajustar a posição do cursor (esta parte é a mais complexa)
    if (posicaoCursorOriginal !== null) {
      let novaPosicaoCursor = posicaoCursorOriginal;

      // Contar os separadores no valor formatado até a posição original do cursor (aproximado)
      const separadoresAntesNoFormatado = (valorFormatado.substring(0, novaPosicaoCursor).match(/[\.\-]/g) || []).length;
      // Contar os separadores no valor anterior até a posição original do cursor
      const separadoresAntesNoOriginal = (valorAnterior.substring(0, posicaoCursorOriginal).match(/[\.\-]/g) || []).length;

      novaPosicaoCursor += (separadoresAntesNoFormatado - separadoresAntesNoOriginal);

      // Se um caractere foi adicionado e resultou na inserção de um separador
      if (valorFormatado.length > valorAnterior.length) {
        if ((valorFormatado.charAt(posicaoCursorOriginal) === '.' || valorFormatado.charAt(posicaoCursorOriginal) === '-') &&
          !(valorAnterior.charAt(posicaoCursorOriginal - 1) === '.' || valorAnterior.charAt(posicaoCursorOriginal - 1) === '-')) {
          // Tenta avançar o cursor para depois do separador recém-adicionado
          if (posicaoCursorOriginal < valorFormatado.length &&
            (valorFormatado.charAt(posicaoCursorOriginal) === '.' || valorFormatado.charAt(posicaoCursorOriginal) === '-')) {
            // Esta lógica é um pouco diferente da anterior, pois o cursor original é relativo ao valor *antes* da formatação.
            // Precisamos considerar o comprimento do valor numérico.
            if ((valorNumerico.length === 2 && valorAnterior.replace(/\D/g, '').length === 1) || // digitou o 2º, adicionou '.'
              (valorNumerico.length === 5 && valorAnterior.replace(/\D/g, '').length === 4)) {  // digitou o 5º, adicionou '-'
              novaPosicaoCursor = posicaoCursorOriginal + 1;
            }
          }
        }
      }

      // Garante que o cursor não ultrapasse o limite do valor formatado
      novaPosicaoCursor = Math.min(novaPosicaoCursor, valorFormatado.length);
      // Garante que o cursor não seja negativo
      novaPosicaoCursor = Math.max(novaPosicaoCursor, 0);

      // Define a posição do cursor
      // Usar try-catch pois alguns browsers/cenários podem lançar exceção
      try {
        inputElement.setSelectionRange(novaPosicaoCursor, novaPosicaoCursor);
      } catch (e) {
        console.warn("Não foi possível definir a posição do cursor:", e);
      }
    }
  }  
  
  
  /*
  
  outra forma de pegar o cep tabem muito eficiente

  colocar isto no ngInit
  this.setupCepListener();

  setupCepListener(): void {
    const cepControl = this.enderecoForm.get('cep');
    if (cepControl) {
      cepControl.valueChanges.pipe(
        takeUntil(this.destroy$), // Desinscreve quando o componente é destruído
        map(value => typeof value === 'string' ? value.replace(/\D/g, '') : ''), // Pega apenas os números
        debounceTime(300),         // Espera 300ms após o usuário parar de digitar
        distinctUntilChanged(),    // Só emite se o valor numérico realmente mudou
        filter(numericCep => numericCep.length === 8) // Só prossegue se tiver 8 dígitos
      ).subscribe(numericCep => {
        console.log('CEP com 8 dígitos numéricos detectado:', numericCep);
        this.buscarCep(numericCep); // Chama o método que realmente busca
      });
    }
  }*/

  private setupLogradouroNomeListener(): void {
    this.enderecoForm.get('logradouroNome')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(400),
      distinctUntilChanged(),
      filter(term => {
        // 1. VERIFICAR SE O TIPO DE LOGRADOURO FOI SELECIONADO
        const tipoLogradouroId = this.enderecoForm.get('tipoLogradouro')?.value;
        const cidadeNome = this.enderecoForm.get('cidadeNome')?.value; // Pega o nome da cidade do form
        
        if (!tipoLogradouroId || !cidadeNome) { // <<<< ALTERAÇÃO: VERIFICAR AMBOS
          if (typeof term === 'string' && term.length > 0) {
            if (!tipoLogradouroId) {
              this.toastrService.warning('Selecione um Tipo de Logradouro antes de buscar.', 'Atenção', { duration: 3000 });
            }
            if (!cidadeNome) { // <<<< ADICIONAR MENSAGEM PARA CIDADE
              this.toastrService.warning('Selecione uma Cidade antes de buscar o logradouro.', 'Atenção', { duration: 3000 });
            }
          }
          this.logradourosPesquisa = [];
          return false; // Bloqueia a busca se algum dos dois faltar
        }

        // 2. O resto da sua lógica de filtro continua aqui
        if (this.isSelectingLogradouro) {
          this.isSelectingLogradouro = false;
          return false;
        }
        if (typeof term === 'object' && term !== null) {
          return false;
        }
        if (typeof term === 'string' && term.length >= 3) {
          return true; // Só prossegue se o tipo estiver selecionado E o termo for longo o suficiente
        }
        this.logradourosPesquisa = [];
        return false;
      }),
      tap(() => {
        // Sua lógica de tap continua igual
        this.isLoadingLogradouros = true;
        this.logradourosPesquisa = [];

        (this.enderecoForm.get('bairros') as FormGroup).patchValue({ id: null, nome: null }, { emitEvent: false });
      }),
      switchMap(nome => {
        // 3. PASSAR O TIPO DE LOGRADOURO PARA O SERVIÇO
        if (typeof nome === 'string') {
          const tipoLogradouroId = this.enderecoForm.get('tipoLogradouro')?.value;
          const cidadeNome       = this.enderecoForm.get('cidadeNome')?.value;
          const cidadeId         = this.enderecoForm.get('cidadeId')?.value;
          return this.logradouroService.buscarLogradourosPorTipoNome(nome, tipoLogradouroId,cidadeNome,cidadeId);
        }
        return of([]);
      })
    ).subscribe({
      // Seu subscribe continua igual
      next: (logradouros) => {
        this.isLoadingLogradouros = false;
        this.logradourosPesquisa = logradouros;
      },
      error: () => { /* ... */ }
    });
  }

  onLogradouroSelecionado(logradouro: LogradouroPesquisaOut | string): void {

    if (typeof logradouro === 'string' || !logradouro) {
        // Se o usuário apagar o campo ou não selecionar nada, ou se for string (evento de limpar)
        this.logradourosPesquisa = []; // Limpa sugestões
        // Poderia resetar campos aqui se desejado quando o campo logradouroNome é limpo
        return;
    }

    this.isSelectingLogradouro = true;

    this.logradouroId = logradouro.id;
    this.cepId        = logradouro.cepId;
    const primeiroBairro = logradouro.bairros && logradouro.bairros.length > 0 ? logradouro.bairros[0] : null;
    this.bairroId = primeiroBairro ? primeiroBairro.id : 0;

    let cepFormatadoParaDisplay = logradouro.cep; // Assume que pode vir formatado ou não
    if (logradouro.cep && /^\d{8}$/.test(logradouro.cep)) { // Se for 8 dígitos
      cepFormatadoParaDisplay = this.formatarCepParaDisplay(logradouro.cep);
    }

    // Importante: use patchValue com { emitEvent: false } para não disparar valueChanges novamente
    this.enderecoForm.patchValue({
      id: logradouro.id,
      logradouroNome: logradouro.logradouroNome,
      //tipoLogradouro: logradouro.tipoLogradouro,
      bairros: logradouro.bairros,
      cidadeNome: logradouro.cidadeNome,
      uf: logradouro.uf,
      cep: cepFormatadoParaDisplay,
    }, { emitEvent: false });

    const bairroControl = this.enderecoForm.get('bairros') as FormGroup;
    if (logradouro.bairros && logradouro.bairros.length > 0) {
        this.bairros = logradouro.bairros;
        const primeiroBairro = logradouro.bairros[0];
        
        const bairroControl = this.enderecoForm.get('bairros') as FormGroup;
        bairroControl.patchValue({
          id: primeiroBairro.id
        });
        this.bairroId = primeiroBairro.id || 0;
      } else {
        this.bairros = []; 
        this.bairroId = 0;
    }
    
    this.logradourosPesquisa = []; 
  }

  /*displayFn(logradouro: LogradouroPesquisaOut): string {
    return logradouro && logradouro.logradouroNome ? logradouro.logradouroNome : '';
  }*/


  /*  CIDADE POR NOME */ 
  private setupCidadeNomeListener(): void {
    this.enderecoForm.get('cidadeNome')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(400),
      distinctUntilChanged(),
      filter(term => {
        // 1. VERIFICAR SE O TIPO DE LOGRADOURO FOI SELECIONADO
        const tipoLogradouroId = this.enderecoForm.get('tipoLogradouro')?.value;

        if (!tipoLogradouroId) {
          // Mostra uma mensagem se o tipo não foi selecionado e o usuário tenta digitar o nome
          if (typeof term === 'string' && term.length > 0) {
            this.toastrService.warning('Selecione um Tipo de Logradouro antes de buscar.', 'Atenção', { duration: 3000 });
          }
          this.cidadesPesquisa = [];
          return false; // Bloqueia a busca
        }

        // 2. O resto da sua lógica de filtro continua aqui
        if (this.isSelectingCidade) {
          this.isSelectingCidade = false;
          return false;
        }
        if (typeof term === 'object' && term !== null) {
          return false;
        }
        if (typeof term === 'string' && term.length >= 3) {
          return true; // Só prossegue se o tipo estiver selecionado E o termo for longo o suficiente
        }
        this.cidadesPesquisa = [];
        return false;
      }),
      tap(() => {
        // Sua lógica de tap continua igual
        this.isLoadingCidades = true;
        this.cidadesPesquisa = [];
      }),
      switchMap(nome => {
        // 3. PASSAR O TIPO DE LOGRADOURO PARA O SERVIÇO
        if (typeof nome === 'string') {
          return this.cidadeService.buscarCidadesPorNome(nome);
        }
        return of([]);
      })
    ).subscribe({
      next: (cidades) => {
        this.cidadesPesquisa = cidades;  
        this.isLoadingCidades = false;  
        //console.log('Cidades para exibir no autocomplete:', this.cidadesPesquisa);
      },
      error: (err) => { // Seu bloco de erro existente
        this.isLoadingCidades = false; // Também esconder o spinner em caso de erro
        this.cidadesPesquisa = []; // Limpar a lista em caso de erro
        console.error('Erro ao buscar cidades:', err);
        this.toastrService.danger('Não foi possível buscar as cidades.', 'Erro de API');
      }
    });
  }

  ///////////////////////////////

  onCidadeSelecionada(cidade: CidadePesquisaOut | string): void {

    if (typeof cidade === 'string' || !cidade) {
        // Se o usuário apagar o campo ou não selecionar nada, ou se for string (evento de limpar)
        this.cidadesPesquisa = []; // Limpa sugestões
        // Poderia resetar campos aqui se desejado quando o campo logradouroNome é limpo
        return;
    }

    this.isSelectingCidade = true;

    this.cidadeId = cidade.id;

    // Importante: use patchValue com { emitEvent: false } para não disparar valueChanges novamente
    this.enderecoForm.patchValue({
      id: cidade.id,
      cidadeNome: cidade.cidadeNome,
      uf: cidade.uf,
    }, { emitEvent: false });

    this.cidadesPesquisa = []; 
  }

}