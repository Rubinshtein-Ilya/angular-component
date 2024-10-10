import { Component, Input, OnInit } from "@angular/core";
import { CatalogTransformEntitiesService } from "../../services/catalog-transform-entities.service";
import { Router } from "@angular/router";
import { CatalogService } from "../../services/catalog.service";

@Component({
    selector: 'app-catalog-cards',
    templateUrl: './catalog-cards.component.html',
    styleUrls: ['./catalog-cards.component.scss']
})

export class CatalogCardsComponent implements OnInit{
    @Input() entities: IAgency[] | IAgent[] | IBuilder[]
    @Input() role: number
    skillsText: string


    constructor(
        private readonly catalogTransformService: CatalogTransformEntitiesService,
        private readonly router: Router,
        private readonly catalogService: CatalogService
    ){}


    ngOnInit(): void {
    }

    setAvatar(avatarUrl: string, role: number): string {
        return this.catalogTransformService.getAvatar(avatarUrl,role)
    }


    redirectToSingleCard(id: string): void {
        this.catalogService.changeCatalogVissibility(false)
        this.router.navigate([`/catalog/${id}`])
    }

    transformSkillsText(skills: string[]) {
        return this.catalogTransformService.getSkillsText(skills)
    }
}







