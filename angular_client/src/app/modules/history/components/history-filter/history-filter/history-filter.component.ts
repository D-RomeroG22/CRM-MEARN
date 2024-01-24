import {
      AfterViewInit,
      Component,
      ElementRef,
      EventEmitter,
      OnDestroy,
      OnInit,
      Output,
      ViewChild,
} from "@angular/core";
import { FilterInterface } from "../../../../../shared/interfaces/filter.interface";
import {
      MaterialDatepickerInterface,
      MaterialService,
} from "../../../../../shared/classes/material.service";

@Component({
      selector: "crm-history-filter",
      templateUrl: "./history-filter.component.html",
      styleUrls: ["./history-filter.component.css"],
})
export class HistoryFilterComponent
      implements OnInit, AfterViewInit, OnDestroy
{
      order: number | undefined;
      @Output("filterBy") onFilter = new EventEmitter<FilterInterface>();
      @ViewChild("startPicker") startPickerRef: ElementRef | undefined;
      @ViewChild("endPicker") endPickerRef: ElementRef | undefined;
      private startPicker: MaterialDatepickerInterface | undefined;
      private endPicker: MaterialDatepickerInterface | undefined;
      isValid = true;
      constructor(private materialService: MaterialService) {}
      submitFilter() {
            const actualFilter: FilterInterface = {};

            if (this.order) {
                  actualFilter.order = this.order;
            }
            if (this.startPicker?.date) {
                  actualFilter.start = this.startPicker?.date;
            }
            if (this.endPicker?.date) {
                  actualFilter.end = this.endPicker?.date;
            }
            this.onFilter.emit(actualFilter);
      }

      ngOnInit(): void {}

      ngOnDestroy(): void {
            this.startPicker?.destroy();
            this.endPicker?.destroy();
      }

      ngAfterViewInit(): void {
            this.startPicker = this.materialService.initDatePicker(
                  this.startPickerRef?.nativeElement,
                  this.validate.bind(this),
            );
            this.endPicker = this.materialService.initDatePicker(
                  this.endPickerRef?.nativeElement,
                  this.validate.bind(this),
            );
      }

      private validate() {
            if (!this.startPicker?.date || !this.endPicker?.date) {
                  this.isValid = true;
                  return;
            }
            this.isValid = this.startPicker?.date < this.endPicker?.date;
      }
}
