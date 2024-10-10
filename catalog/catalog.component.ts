import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { CatalogService } from "./services/catalog.service";
import { NavigationEnd, Router } from "@angular/router";

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CatalogComponent implements OnInit, OnDestroy{
    isOptions: boolean = false
    isCleanButton: boolean = false
    form: FormGroup
    isCatalogVisible: boolean = true
    destoy$ = new ReplaySubject<any>()
    role: string 
    region: string 
    isModal: boolean = false
    headingValues = {
        agency: "агентств",
        agents: "риэлторов",
        builders: "застройщиков",
    }

    constructor(
        private readonly fb: FormBuilder, 
        private readonly catalogService: CatalogService,
        private readonly router: Router,
        private readonly cdr: ChangeDetectorRef,
    //    private location: Location
    ){}

    ngOnInit(): void {
        this.initializeForm()
        this.initializeValues()
        this.getRole()
        this.watchFormValues()
    }

    ngOnDestroy(): void {
        this.destoy$.next('end')
        this.destoy$.complete()
    }

    getRole(): void {
        let currentUrl = this.router.url.split('/');
        this.role = currentUrl[currentUrl.length - 1]
        this.router.events
        .pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntil(this.destoy$)
        )
        .subscribe(() => {
            currentUrl = this.router.url.split('/');
            this.role = currentUrl[currentUrl.length - 1]
        });
    }

    initializeValues(): void {
        this.catalogService.isCatalogVisible$
        .pipe(takeUntil(this.destoy$))
        .subscribe(value => {
            this.isCatalogVisible = value
            this.cdr.markForCheck()
        })
        
      
    }

    initializeForm(): void {
        this.form = this.fb.group({
            search: [''],
            skills: this.fb.array([]),
            region: ['Москва']
        })
        this.region = this.form.controls['region'].value
    }

    watchFormValues(): void {
        this.form.valueChanges
        .pipe(takeUntil(this.destoy$))
        .subscribe(formObj => {
            if (formObj['search'] !== '' || formObj['skills'].length) {
                this.isCleanButton = true
            } else {
                this.isCleanButton = false
            }

            this.region = formObj['region']
        })
    }

    onCheckboxChange(event: any) {
        const skillsArray: FormArray = this.form.get('skills') as FormArray;
        const dependentSkills = ['building', 'hypotec', 'management'];
        const saleSkills = ['living-sale', 'countryside-sale', 'commerce-sale'];
        const rentSkills = ['living-rent', 'countryside-rent', 'commerce-rent'];
        
        if (event.target.value === 'other') {
            if (event.target.checked) {
            dependentSkills.forEach(skill => {
                if (!skillsArray.value.includes(skill)) {
                skillsArray.push(new FormControl(skill));
                this.setCheckboxState(skill, true); 
                }
            });
            } else {
            dependentSkills.forEach(skill => {
                const index = skillsArray.controls.findIndex(x => x.value === skill);
                if (index !== -1) {
                skillsArray.removeAt(index);
                this.setCheckboxState(skill, false); 
                }
            });
            }
        } else if (event.target.value === 'sale') {
            if (event.target.checked) {
            saleSkills.forEach(skill => {
                if (!skillsArray.value.includes(skill)) {
                skillsArray.push(new FormControl(skill));
                this.setCheckboxState(skill, true); 
                }
            });
            } else {
            saleSkills.forEach(skill => {
                const index = skillsArray.controls.findIndex(x => x.value === skill);
                if (index !== -1) {
                skillsArray.removeAt(index);
                this.setCheckboxState(skill, false); 
                }
            });
            }
        } else if (event.target.value === 'rent') {
            if (event.target.checked) {
            rentSkills.forEach(skill => {
                if (!skillsArray.value.includes(skill)) {
                skillsArray.push(new FormControl(skill));
                this.setCheckboxState(skill, true); 
                }
            });
            } else {
            rentSkills.forEach(skill => {
                const index = skillsArray.controls.findIndex(x => x.value === skill);
                if (index !== -1) {
                skillsArray.removeAt(index);
                this.setCheckboxState(skill, false); 
                }
            });
            }
        } else {
            if (event.target.checked) {
            skillsArray.push(new FormControl(event.target.value));
            } else {
            const index = skillsArray.controls.findIndex(x => x.value === event.target.value);
            if (index !== -1) {
                skillsArray.removeAt(index);
            }
            }
        }
    }

    setCheckboxState(id: string, state: boolean) {
        const checkbox = document.getElementById(id) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = state;
        }
    }


    showOptions(): void {
        this.isOptions = !this.isOptions
    }

    resetForm(): void {

        this.form.reset({
            search: '', 
        });
    
        const skillsArray = this.form.controls['skills'] as FormArray;
        skillsArray.clear(); 
    
        this.resetCheckboxesState();
    
        this.isCleanButton = false; 
    }
    
    resetCheckboxesState(): void {
        const checkboxes = document.querySelectorAll('.options__checkbox') as NodeListOf<HTMLInputElement>;
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; 
        });
        this.isOptions = false
    }

    loadComponentWithParams(): void{
        const queryParams = this.form.value;

        this.router.navigate([], {
            // relativeTo: this.route, // если нужно сохранить текущий путь
            queryParams: queryParams, 
            queryParamsHandling: 'merge' 
        });

        this.catalogService.getFilters(this.form.value)
        this.catalogService.isNewFilters$.next(true)
        this.isOptions = false
    }

    showModal(): void {
        this.isModal = !this.isModal
    }

    setRegion(region: string): void {
        this.form.controls['region'].setValue(region)
    }
}