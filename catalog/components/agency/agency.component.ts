import { Component, OnInit } from "@angular/core";
import { CatalogService } from "../../services/catalog.service";
import { Observable, ReplaySubject, of } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-agency',
    templateUrl: './agency.component.html',
    styleUrls: ['./agency.component.scss']
})

export class AgencyComponent implements OnInit{
    agencies$: Observable<IAgency[]>
    type: string = '1'
    isLoading: boolean
    destoy$ = new ReplaySubject<any>()

    constructor(private readonly catalogService: CatalogService){}


    ngOnInit(): void {
        this.initializeValues()
        this.catalogService.isNewFilters$.subscribe(val => {
                if (val) {
                    this.catalogService.isNewFilters$.next(false)
                    this.initializeValues()
                }
        })
    }


    initializeValues(): void {
        this.catalogService.isLoading$
        .pipe(takeUntil(this.destoy$))
        .subscribe(value => {
            this.isLoading = value
        })

        this.agencies$ = this.catalogService.getEntities(this.type).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Ошибка при получении данных:', error.message);
                return of(null); 
            })
        );
    }

}