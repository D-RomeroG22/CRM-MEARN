import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HistoryComponent } from "./components/history.component";
import { HistoryListComponent } from "./components/history-list/history-list/history-list.component";
import { HistoryFilterComponent } from "./components/history-filter/history-filter/history-filter.component";
import { LoaderModule } from "../../shared/components/loader/loader.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
      declarations: [
            HistoryComponent,
            HistoryListComponent,
            HistoryFilterComponent,
      ],
      imports: [CommonModule, LoaderModule, ReactiveFormsModule, FormsModule],
})
export class HistoryModule {}
