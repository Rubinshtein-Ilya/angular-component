import { Component, OnDestroy, OnInit } from "@angular/core";
import { CatalogService } from "../../services/catalog.service";
import { Observable, ReplaySubject, of } from "rxjs";
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-builders',
    templateUrl: './builders.component.html',
    styleUrls: ['./builders.component.scss']
})

export class BuildersComponent implements OnInit, OnDestroy{
    builders$: Observable<IBuilder[]>
    type: string = '2'
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
    ngOnDestroy(): void {
        this.destoy$.next(null)
        this.destoy$.complete()
    }

    initializeValues(): void {
        this.catalogService.isLoading$
        .pipe(takeUntil(this.destoy$))
        .subscribe(value => {
            this.isLoading = value
        })

        this.builders$ = this.catalogService.getEntities(this.type).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Ошибка при получении данных:', error.message);
                return of(null); 
            })
        );
    }

}