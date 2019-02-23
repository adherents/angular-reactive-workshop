import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';

import { ProjectsActionTypes, LoadProjects, ProjectsLoaded, AddProject, ProjectAdded } from './projects.actions';
import { ProjectsService, Project, ProjectsState } from '@workshop/core-data';

@Injectable({providedIn: 'root'})
export class ProjectsEffects {
  @Effect()
  loadProjects$ = this.dataPersistence.fetch(ProjectsActionTypes.LoadProjects, {
    run: (action: LoadProjects, state: ProjectsState) => {
      return this.projectsService.all().pipe(map((res: Project[]) => new ProjectsLoaded(res)))
    },
    onError: (action: LoadProjects, error) => {
      console.error('Error', error);
    }
  });

  @Effect()
  addProject$ = this.dataPersistence.pessimisticUpdate(ProjectsActionTypes.AddProject, {
    run: (action: AddProject, state: ProjectsState) => {
      return this.projectsService.create(action.payload).pipe(map((res: Project) => new ProjectAdded(res)))
    },
    onError: (action: AddProject, error) => {
      console.error('Error', error);
    }
  });

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<ProjectsState>,
    private projectsService: ProjectsService
  ) {}
}
