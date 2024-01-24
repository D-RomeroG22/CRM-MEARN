import {
      AfterViewInit,
      Component,
      ElementRef,
      OnDestroy,
      OnInit,
      ViewChild,
} from "@angular/core";
import {
      MaterialInterface,
      MaterialService,
} from "../../../shared/classes/material.service";
import { OrdersService as HttpOrdersService, OrdersService } from "../../../shared/services/orders/orders.service";
import { Subject, takeUntil } from "rxjs";
import { environment } from "../../../../enviroments/environment";
import { FilterInterface } from "../../../shared/interfaces/filter.interface";
import { OrderInterface } from "src/app/shared/interfaces/option.interface";
import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
      selector: "crm-history",
      templateUrl: "./history.component.html",
      styleUrls: ["./history.component.css"],
})
export class HistoryComponent implements AfterViewInit, OnDestroy, OnInit {
      showFilter = false;
      offset = 0;
      limit = environment.STEP;
      filterTooltip!: MaterialInterface;
      historyList: OrderInterface[] = [];
      isAlive = new Subject<void>();
      @ViewChild("tooltip") tooltipRef: ElementRef | undefined;
      loadingFlag = false;
      reloadingFlag = false;
      noMoreFlag = false;
      private filter: FilterInterface = {};
      constructor(
            private materialService: MaterialService,
            private ordersService: OrdersService,
            private authService: AuthService,
      ) { }
      triggerFilter() {
            this.showFilter = !this.showFilter;
            this.changeTooltipNotification();
            if (!this.showFilter && !!Object.keys(this.filter).length) {
                  this.historyList = [];
                  this.filter = {};
                  this.fetch();
            }
      }

      reloadContent() {
            this.historyList = [];
            this.offset = 0;
            this.filter = {};
            this.reloadingFlag = true;
            this.fetch();
      }

      onOrderFinished() {
            this.reloadContent();
      }

      loadMore() {
            this.loadingFlag = true;
            this.offset += environment.STEP;
            this.fetch();
      }

      ngAfterViewInit(): void {
            this.filterTooltip = this.materialService.initTooltip(
                  this.tooltipRef?.nativeElement,
            );
      }

      ngOnDestroy(): void {
            this.isAlive.next();
            this.isAlive.complete();
            this.filterTooltip.destroy();
      }

      private changeTooltipNotification() {
            if (this.showFilter) {
                  this.tooltipRef?.nativeElement.setAttribute(
                        "data-tooltip",
                        "Close tooltip",
                  );
            } else {
                  this.tooltipRef?.nativeElement.setAttribute(
                        "data-tooltip",
                        "Open tooltip",
                  );
            }
      }

      ngOnInit(): void {
            this.reloadingFlag = true;
            this.fetch();
      }

      private fetch() {
            const params: { offset: number; limit: number } = {
                  offset: this.offset,
                  limit: this.limit,
            };

            if (this.authService.isAdmin()) {
                  this.ordersService.getAllOrders(params)
                        .pipe(takeUntil(this.isAlive))
                        .subscribe(
                              (orders: OrderInterface[]) => {
                                    this.historyList = [...this.historyList, ...orders];
                                    this.loadingFlag = false;
                                    this.reloadingFlag = false;
                                    this.noMoreFlag = orders.length < this.limit;
                              },
                              (error: Error) => {
                                    console.error('Error fetching orders:', error);
                              }
                        );
            } else {
                  const currentUserId = this.authService.getCurrentUserId();
                  if (currentUserId) {
                        this.ordersService.getOrdersByUser(currentUserId, params)
                              .pipe(takeUntil(this.isAlive))
                              .subscribe(
                                    (orders: OrderInterface[]) => {
                                          this.historyList = [...this.historyList, ...orders];
                                          this.loadingFlag = false;
                                          this.reloadingFlag = false;
                                          this.noMoreFlag = orders.length < this.limit;
                                    },
                                    (error: Error) => { 
                                          console.error('Error fetching orders:', error);
                                    }
                              );
                  } else {
                        console.error('Error fetching orders: Current user ID is undefined.');
                  }
            }
      }


      applyFilter($event: FilterInterface) {
            this.historyList = [];
            this.offset = 0;
            this.filter = $event;
            this.reloadingFlag = true;
            this.fetch();
      }

      isFiltered(): boolean {
            return !!Object.keys(this.filter).length;
      }
}
