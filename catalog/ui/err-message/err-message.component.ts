import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component ({
    selector: 'app-err-message',
    templateUrl: './err-message.component.html',
    styleUrls: ['./err-message.component.scss']
})

export class ErrorMessageComponent implements OnInit, OnDestroy{
    @Input() control!: FormControl
    @Input() isTextarea: boolean = false
    destroy$ = new ReplaySubject<any>()

    ngOnInit(): void {
        if(this.control) {
            this.control.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => {
                console.log(val)
            })
        }
        
    }

    ngOnDestroy(): void {
        this.destroy$.next(null)
        this.destroy$.complete()
    }
}