import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  
  {
    title: 'AÇÕES',
    group: true,
  },

  {
    title: 'Cadastros',
    icon: 'layout-outline',
    children: [

      // =================================================================
      // <<< NOVO SUB-MENU DE SEGURANÇA ADICIONADO AQUI
      // =================================================================
      {
        title: 'Segurança',
        // icon: 'lock-outline', // Você pode adicionar um ícone se quiser
        children: [
          {
            title: 'Empresas',
            link: '/pages/empresas/empresas-iud', // Rota para o módulo de empresas
          },
          {
            title: 'Perfis',
            link: '/pages/perfis/perfis-iud', // Rota para o módulo de empresas
          },
          {
            title: 'Usuários',
            link: '/pages/usuarios/usuarios-pesquisa', // Rota para o futuro módulo de usuários
          },
        ],
      },

      // =================================================================

      // =================================================================
      // <<< NOVO SUB-MENU DE NATAÇÃO ADICIONADO AQUI
      // =================================================================
      {
        title: 'Natação',
        // icon: 'lock-outline', // Você pode adicionar um ícone se quiser
        children: [
          {
        title: 'Atletas',
        link: '/pages/atletas/atletas-pesquisa',
      },

      {
        title: 'Campeonatos',
        link: '/pages/campeonatos/campeonatos-pesquisa',
      },
      {
        title: 'Categorias',
        link: '/pages/categorias/categorias-uid',
      },
      {
        title: 'Equipes',
        link: '/pages/equipes/equipes-pesquisa', 
      },
      {
        title: 'Etapas',
        link: '/pages/etapas/etapas-pesquisa',
      },
      {
        title: 'Locais Competições',
        link: '/pages/locais-competicoes/locais-competicoes-iud',
      },
      {
        title: 'Modalidades',
        link: '/pages/modalidades/modalidade-iud',
      },

      {
        title: 'Pontuação',
        link: '/pages/pontuacao/pontuacao-iud',
      },

      {
        title: 'Provas',
        link: '/pages/provas/provas-pesquisa',
      },

      {
        title: 'Tipos Nado (Estilos)',
        link: '/pages/tipos-nado/tipos-nado-iud',
      },
        ],
      },

      // =================================================================
      // <<< NOVO SUB-MENU DE PESSOAS ADICIONADO AQUI
      // =================================================================
      {
        title: 'Pessoas',
        // icon: 'lock-outline', // Você pode adicionar um ícone se quiser
        children: [
          {
            title: 'Pessoas',
                link: '/pages/pessoas-api/pessoa-api-pesquisa',
            },
        ],
      },

      // =================================================================
     
    ],
  },
  {
    title: 'Atividades',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'Digitar/Apurar Resultados',
        link: '/pages/apuracoes/apuracoes-pesquisa',
      },
      {
        title: 'Inscrições',
        link: '/pages/inscricoes/inscricoes-pesquisa',
      },

    ],
  },
  {
    title: 'Consultas',
    icon: 'keypad-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Grid',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'Icons',
        link: '/pages/ui-features/icons',
      },
      {
        title: 'Typography',
        link: '/pages/ui-features/typography',
      },
      {
        title: 'Animated Searches',
        link: '/pages/ui-features/search-fields',
      },
    ],
  },
  {
    title: 'Relatorios',
    icon: 'browser-outline',
    children: [
      {
        title: 'Dialog',
        link: '/pages/modal-overlays/dialog',
      },
      {
        title: 'Window',
        link: '/pages/modal-overlays/window',
      },
      {
        title: 'Popover',
        link: '/pages/modal-overlays/popover',
      },
      {
        title: 'Toastr',
        link: '/pages/modal-overlays/toastr',
      },
      {
        title: 'Tooltip',
        link: '/pages/modal-overlays/tooltip',
      },
    ],
  },
  
];
