import { TestBed } from "@angular/core/testing";

import { OptionsService } from "./option.service";

describe("OptionService", () => {
      let service: OptionsService;

      beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(OptionsService);
      });

      it("should be created", () => {
            expect(service).toBeTruthy();
      });
});
