import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Customer, Project, NotificationsService, CustomersService, ProjectsFacade } from '@workshop/core-data';

const emptyProject: Project = {
  id: null,
  title: '',
  details: '',
  percentComplete: 0,
  approved: false,
  customerId: null
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<Project[]>;
  customers$: Observable<Customer[]>;
  currentProject$: Observable<Project>;

  constructor(
    private customerService: CustomersService,
    private facade: ProjectsFacade,
    private ns: NotificationsService) {
      this.projects$ = facade.projects$;
      this.currentProject$ = facade.currentProject$;
    }

  ngOnInit() {
    this.getProjects();
    this.getCustomers();
    this.resetCurrentProject();
  }

  resetCurrentProject() {
    this.facade.selectProject({id: null});
  }

  selectProject(project) {
    this.facade.selectProject(project);
  }

  cancel(project) {
    this.resetCurrentProject();
  }

  getCustomers() {
    this.customers$ = this.customerService.all();
  }

  getProjects() {
    this.facade.getProjects();
  }

  saveProject(project) {
    if (!project.id) {
      this.createProject(project);
    } else {
      this.updateProject(project);
    }
  }

  createProject(project) {
    this.facade.createProject(project);
    // These will go away
    this.ns.emit('Project created!');
    this.resetCurrentProject();
  }

  updateProject(project) {
    this.facade.updateProject(project);
    // These will go away
    this.ns.emit('Project updated!');
    this.resetCurrentProject();
  }

  deleteProject(project) {
    this.facade.deleteProject(project);
    // These will go away
    this.ns.emit('Project deleted!');
    this.resetCurrentProject();
  }
}

