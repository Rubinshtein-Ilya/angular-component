import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CatalogComponent } from './catalog.component';
import { NgModule } from '@angular/core';
import { AgencyComponent } from './components/agency/agency.component';
import { AgentsComponent } from './components/agents/agents.component';
import { BuildersComponent } from './components/builders/builders.component';
import { SingleCardComponent } from './components/single-card/single-card.component';

const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: CatalogComponent,

    children: [
      {
        path: '',
        redirectTo: 'agency',
        pathMatch: 'full' 
      },
      {
        path: 'agency', 
        component: AgencyComponent
      },
      {
        path: 'agents', 
        component: AgentsComponent
      },
      {
        path: 'builders', 
        component: BuildersComponent
      },
      {
        path: ':id', 
        component: SingleCardComponent
      }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }