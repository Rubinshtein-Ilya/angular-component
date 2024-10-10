import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { CatalogService } from "../../services/catalog.service";
import { Observable, ReplaySubject, of, throwError } from "rxjs";
import { ActivatedRoute} from "@angular/router";
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CatalogTransformEntitiesService } from "../../services/catalog-transform-entities.service";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";


@Component({
    selector: 'app-single-card',
    templateUrl: './single-card.component.html',
    styleUrls: ['./single-card.component.scss']
})

export class SingleCardComponent implements OnInit, OnDestroy{
    singleCard$: Observable<IAgency | IAgent | IBuilder>
    id: string
    role: string
    isLoading: boolean
    destoy$ = new ReplaySubject<any>()
    isTrunc: boolean = true
    isContactsShow: boolean = false
    skillsText: string = ''
    apiUrl: string = environment.apiHost
    form: FormGroup
    isMessageSucces: boolean = false
    isSubmiting: boolean = false



    constructor(
        private readonly catalogService: CatalogService,
        private readonly route: ActivatedRoute,
        private readonly catalogTransformService: CatalogTransformEntitiesService,
        private readonly location: Location,
        private readonly fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ){}


    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
        })
        this.initializeValues()
        this.initializeForm()
        this.singleCard$
        .pipe(takeUntil(this.destoy$))
        .subscribe(card => {
            console.log("CARD", card)
            if(card) {
                this.skillsText = this.catalogTransformService.getSkillsText(card.data.attributes.skills);
                this.role = card.data.attributes.profileType
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

        this.singleCard$ = this.catalogService.getSingleEntity(this.id).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Ошибка при получении данных:', error.message);
                return of(null); 
            })
        );

        this.catalogService.changeCatalogVissibility(false)
    }

    initializeForm(): void {
        this.form = this.fb.group({
            name: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            message: ['', [Validators.required]],
        })
    }

    truncateText(text: string): string {
        if (text.length > 280) {
            return text.slice(0, 280) + '...';
        } else {
            return text;
        }
    }
    truncatePhone(phone: number): string {
        return phone.toString().slice(0,6) + ' ** **'
    }

    changeTrunc(): void {
        this.isTrunc = !this.isTrunc
    }

    setAvatar(avatarUrl: string, role: string): string {
        const roleValues = { 
            'advertiser_cabinet': 0,
            'agency_cabinet': 1,
            'builder_cabinet': 2
        }
        return this.catalogTransformService.getAvatar(avatarUrl,roleValues[role])
    }

    transformDateToText(year: number): string {
        const date = new Date(year, 0, 1);
        const now = new Date();
        let diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
        if (diffInDays < 30) {
            return `${diffInDays} дн.`;
        }
    
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;
    
        let result = '';
        if (years > 0) {
            result += `${years} ${this.getYearDeclension(years)} `;
        }
        if (months > 0) {
            result += `${months} ${this.getMonthDeclension(months)}`;
        }
    
        return result.trim();
    }
    
    getYearDeclension(years: number): string {
        if (years === 1) return 'год';
        if (years >= 2 && years <= 4) return 'года';
        return 'лет';
    }
    
    getMonthDeclension(months: number): string {
        if (months === 1) return 'мес.';
        return 'мес.';
    }

    showContacts(): void {
        this.isContactsShow = !this.isContactsShow
    }

    transformObjectsText(totalObjects: number): string {
        if (totalObjects === 1) return `${totalObjects} лот`
        if (totalObjects > 1 && totalObjects < 5) return `${totalObjects} лота`
        if (totalObjects === 0 || totalObjects >= 5) return `${totalObjects} лотов`
        return ''
    }

    goBack(): void {
        this.catalogService.changeCatalogVissibility(true)
        this.location.back();
    }

    sendMessage(id: string): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }
        this.isSubmiting = true
        this.catalogService.sendMessage(Number(id),this.form.value)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error fetching entity:', error.message);
                return of(null);
            }),
            finalize(() => {
                this.isSubmiting = false
            })
        )
        .subscribe(response => {
            if (response) { 
                this.isMessageSucces = true;
                this.form.reset()
                this.cdr.detectChanges()
                setTimeout(()=> {
                    this.isMessageSucces = false
                    this.cdr.detectChanges()
                },3000)
                
            }
        })
    }
}