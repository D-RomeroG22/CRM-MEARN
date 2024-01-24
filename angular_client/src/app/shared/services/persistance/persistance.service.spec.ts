import { TestBed } from "@angular/core/testing";

import { PersistenceService } from "./persistence.service";

describe("SavingToLocalStorageService", () => {
      let service: PersistenceService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(PersistenceService);
      });

      it("should be created", () => {
            expect(service).toBeTruthy();
      });
});
