import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CatalogComponent } from "./catalog.component";
import SharedModule from "src/app/shared/shared.module";
import { HeaderModule } from "src/app/core/components/header/header.module";
import { RouterModule } from "@angular/router";
import CabinetHeaderComponent from "../cabinet/components/cabinet-header/cabinet-header.component";
import { CabinetMenuComponent } from "../cabinet/components/cabinet-menu/cabinet-menu.component";
import { CatalogRoutingModule } from "./catalog-routing.module";
import { AgencyComponent } from "./components/agency/agency.component";
import { CatalogCardsComponent } from "./components/catalog-cards/catalog-cards.component";
import { AgentsComponent } from "./components/agents/agents.component";
import { BuildersComponent } from "./components/builders/builders.component";
import { SingleCardComponent } from "./components/single-card/single-card.component";
import { AgencySkeletonComponent } from "./ui/agency-skeleton/agency-skeleton.component";
import { ErrorMessageComponent } from "./ui/err-message/err-message.component";





@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      HeaderModule,
      RouterModule,
      CatalogRoutingModule
    ],
    declarations: [
        CatalogComponent,
        CabinetHeaderComponent,
        CabinetMenuComponent,
        AgencyComponent,
        CatalogCardsComponent,
        AgentsComponent,
        BuildersComponent,
        SingleCardComponent,
        AgencySkeletonComponent,
        ErrorMessageComponent
    ],
    exports: [
        CatalogComponent
    ]
  })
  export class CatalogModule {}