import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})

export class CatalogService {
    apiUrl = environment.apiUrl
    isNewFilters$ = new BehaviorSubject<boolean>(false)
    filters: {[key: string]: any}
    isLoading$ = new BehaviorSubject<boolean>(false)
    isCatalogVisible$ = new BehaviorSubject<boolean>(true)

    constructor(private readonly http: HttpClient){}

    getSingleEntity(id: string): Observable<IAgency | IAgent | IBuilder> {
        this.isLoading$.next(true)
        return this.http.get<IAgency | IAgent | IBuilder>(`${this.apiUrl}/companies/${id}`).pipe(
            finalize(() => {
                this.isLoading$.next(false)
            })
        )
    }


    getEntities(type: string): Observable<IAgency[] | IAgent[] | IBuilder[]> {
        this.isLoading$.next(true);
        let params = new HttpParams()
            .set('filter[profileType]', type);
    
        if (this.filters?.skills?.length) {
            params = params.set('skill', this.filters.skills.join(','));
        }
    
        if (this.filters?.search?.length) {
            const filterValues = this.checkString(this.filters.search);
            params = params.set(filterValues[0], filterValues[1]);
        }
    
        if (this.filters?.region?.length) {
            params = params.set('filter[region]', this.filters.region);
        }
    
        return this.http.get<any[]>(`${this.apiUrl}/companies`, { params }).pipe(
            finalize(() => {
                this.isLoading$.next(false);
            })
        );
    }
    
    sendMessage(id: number, message: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/companies/${id}/send_message`, message);
    }
    
    getFilters(formObj: { [key: string]: any }) {
        console.log("SERV", formObj);
        this.filters = formObj;
    }
    
    checkString(value: string): string[] {
        const isNumeric = /^\d+$/.test(value);
    
        if (isNumeric && value.length === 10) {
            return ['filter[phone]', value.trim()];
        } else if (isNumeric && value.length < 10) {
            return ['filter[id]', value.trim()];
        } else {
            return ['filter[name]', value.trim()];
        }
    }

    changeCatalogVissibility(value: boolean): void {
        this.isCatalogVisible$.next(value)
    }
}