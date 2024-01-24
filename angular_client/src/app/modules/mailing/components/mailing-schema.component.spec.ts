import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MailingSchemasComponent } from "./mailing-schema.component";

describe("MailingSchemasComponent", () => {
      let component: MailingSchemasComponent;
      let fixture: ComponentFixture<MailingSchemasComponent>;

      beforeEach(async () => {
            await TestBed.configureTestingModule({
                  declarations: [MailingSchemasComponent],
            }).compileComponents();

            fixture = TestBed.createComponent(MailingSchemasComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it("should create", () => {
            expect(component).toBeTruthy();
      });
});
