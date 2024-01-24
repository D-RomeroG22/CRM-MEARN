import { Injectable } from "@angular/core";
import { UserDetailsInterface } from "../../interfaces/UserDetailsInterface ";

@Injectable({
      providedIn: "root",
})
export class PersistenceService {
      private storage: Storage;

      constructor() {
            this.storage = localStorage;
      }

      saveToken(token: string | null): void {
            if (token) {
                  this.storage.setItem('authToken', token);
            } else {
                  this.storage.removeItem('authToken');
                  this.storage.removeItem('userDetails');
            }
      }

      getToken(): string | null {
            return this.storage.getItem('authToken');
      }

      clearToken(): void {
            this.storage.removeItem('authToken');
      }

      saveUser(user: UserDetailsInterface | null): void {
            if (user) {
                  localStorage.setItem('userDetails', JSON.stringify(user));
            } else {
                  localStorage.removeItem('userDetails');
            }
      }

      getUser(): UserDetailsInterface | null {
            const userJson = this.storage.getItem('userDetails');
            return userJson ? JSON.parse(userJson) : null;
      }
}
