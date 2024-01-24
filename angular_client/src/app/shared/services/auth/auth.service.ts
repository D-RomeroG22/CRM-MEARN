import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserInterface } from "../../interfaces/auth.interface";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { PersistenceService } from "../persistance/persistence.service";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "src/enviroments/environment";
import { UserDetailsInterface } from "../../interfaces/UserDetailsInterface ";

@Injectable({
      providedIn: "root",
})
export class AuthService {
      private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
      public currentUser = this.currentUserSubject.asObservable();
      constructor(
            private http: HttpClient,
            private persistenceService: PersistenceService,
            private jwtHelper: JwtHelperService,
      ) {
            this.loadCurrentUser();
      }

      private loadCurrentUser() {
            const token = this.persistenceService.getToken();
            if (token && !this.jwtHelper.isTokenExpired(token)) {
                  const decodedToken = this.jwtHelper.decodeToken(token);
                  this.getUserDetails(decodedToken.userId).subscribe(
                        (userData: UserDetailsInterface) => {
                              this.persistenceService.saveUser(userData);
                              this.currentUserSubject.next({
                                    ...userData,
                                    email: userData.email || '',
                              });
                        },
                        (error) => {
                              console.error('Error fetching user details:', error);
                              this.currentUserSubject.next(null);
                        }
                  );
            } else {
                  this.currentUserSubject.next(null);
            }
      }

      login(payload: UserInterface): Observable<{ token: string }> {
            return this.http.post<{ token: string }>(
                  `${environment.urls.auth}/login`,
                  payload,
            ).pipe(
                  tap(({ token }) => {
                        this.persistenceService.saveToken(token);
                        const decodedToken = this.jwtHelper.decodeToken(token);
                        this.getUserDetails(decodedToken.userId).subscribe(
                              (user: UserDetailsInterface) => {
                                    this.persistenceService.saveUser(user);
                                    this.currentUserSubject.next({
                                          ...user,
                                          email: user.email || '',
                                    });
                              },
                              (error) => { }
                        );
                  }),
            );
      }

      register(user: UserInterface): Observable<UserInterface> {
            return this.http.post<UserInterface>(
                  `${environment.urls.auth}/register`,
                  user,
            );
      }

      update(user: UserInterface): Observable<UserInterface> {
            return this.http.post<UserInterface>(
                  `${environment.urls.auth}/update`,
                  user,
            );
      }

      isAuthenticated(): boolean {
            const token = this.persistenceService.getToken();
            return !!token && !this.jwtHelper.isTokenExpired(token);
      }

      logout() {
            this.persistenceService.saveToken(null);
            this.currentUserSubject.next(null);
      }

      get currentUserValue(): UserInterface | null {
            return this.currentUserSubject.value;
      }
      getUserDetails(userId: string): Observable<UserDetailsInterface> {

            return this.http.get<UserDetailsInterface>(`${environment.urls.user}/${userId}`);
      }

      isAdmin(): boolean {
            const user = this.currentUserSubject.value;
            return user?.admin === true;
      }

      getCurrentUserId(): string | undefined {
            return this.currentUserSubject.value?._id;
      }

      updateProfile(userData: UserInterface): Observable<any> {
            return this.http.patch<UserDetailsInterface>(`${environment.urls.user}/${userData._id}`,userData);
      }
}
