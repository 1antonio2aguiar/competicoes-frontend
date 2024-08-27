import { ConfirmationService } from 'primeng/api';
import { OnInit, Directive } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';


@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];
  totalRegistros = 0;
  messageService: MessageService = new MessageService;

  constructor(
    private resourceService: BaseResourceService<T>,
    public confirmationService: ConfirmationService,
    messageService: MessageService
  ) {
  }

  ngOnInit() { }

  delete(resource: T, funcOk: Function, funcFail: Function) {
    const resourceId = resource.id ?? 0; // Se resource.id for undefined, use 0 como valor padrão
    this.resourceService.delete(resourceId).subscribe(
      () => {
        this.resources = this.resources.filter(element => element !== resource);
        funcOk(this.messageService);
      },
      fail => {
        //console.log(fail);
        funcFail(fail, this.messageService);
      }
    );
  }
}
