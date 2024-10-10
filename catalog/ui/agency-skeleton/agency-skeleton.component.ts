import { Component, Input, OnInit } from "@angular/core";
import { CatalogService } from "../../services/catalog.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-agency-skeleton',
    templateUrl: './agency-skeleton.component.html',
    styleUrls: ['./agency-skeleton.component.scss']
})

export class AgencySkeletonComponent implements OnInit{
    @Input() role: string


    constructor(private readonly catalogService: CatalogService){}


    ngOnInit(): void {
        this.initializeValues()
    }

    initializeValues(): void {
    }

}