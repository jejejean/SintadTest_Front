import { inject, Injectable } from '@angular/core';
import { EntityRequest, EntityResponse } from '@interfaces/entity';
import { EntityService } from '@services/entity.service';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityStateService {
  entityService = inject(EntityService);
  toastr = inject(ToastrService);
  entitySubject: BehaviorSubject<EntityResponse[]> = new BehaviorSubject<
    EntityResponse[]
  >([]);
  entity$: Observable<EntityResponse[]> = this.entitySubject.asObservable();

  constructor() {}

  getAllEntityTypes(): void {
    this.entityService.getAllEntities().subscribe({
      next: (entityResponse: EntityResponse[]) => {
        this.entitySubject.next(entityResponse);
      },
      error: (error) => {
        this.toastr.info(error.error.message, 'Información');
      },

    });
  }

  addEntity(entityResponse: EntityResponse): void {
    const entity = this.entitySubject.getValue();
    entity.unshift(entityResponse);
    this.entitySubject.next(entity);
  }

  updateEntity(entityRequest: EntityRequest, id: number): void {
    const entity = this.entitySubject.getValue();
    const index = entity.findIndex((doc) => doc.idEntity === id);
    if (index !== -1) {
      entity[index] = entityRequest;
      this.entitySubject.next(entity);
    }
  }

  deleteEntity(id: number): void {
    const entity = this.entitySubject.getValue();
    const deleteEntity = entity.filter((doc) => doc.idEntity !== id);
    this.entitySubject.next(deleteEntity);
  }
}
