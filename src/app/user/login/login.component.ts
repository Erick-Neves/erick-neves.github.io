import { Component, OnInit } from '@angular/core';
import { Oauth2 } from 'src/app/model/Oauth2';
import { UserLogin } from 'src/app/model/UserLogin';
import { AuthService } from 'src/app/service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertsService } from 'src/app/service/alerts.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oauth2: Oauth2 = new Oauth2
  userLogin: UserLogin = new UserLogin
  token: string
  loggedPass: string
  idLogged: number
  username: string
  
  loginForm: FormGroup = new FormGroup({
    email : new FormControl('username', [Validators.required]),
    password : new FormControl('password', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private alerts: AlertsService
    ) { }

  ngOnInit(){
    window.scroll(0,0)
  }

  login(){
    const userToSave: UserLogin = this.userLogin
    this.authService
      .getInfoFromUserUsername(this.userLogin.username)
        .subscribe({
          next: (userSigned) => {
            if (userSigned == null){
              console.log("User not found!")
              this.router.navigate(['/auth/signin'])
              this.alerts.showAlertDanger("User not found! Sign-in first")
            } else {
              this.authService.getUserLogged(userToSave.username)
                .subscribe({
                  next: (resp) => {
                    if (resp != null){
                      console.log("User found, has logged:")
                      environment.id = resp.id
                      environment.firstName = resp.firstname
                      environment.lastName = resp.lastname
                      environment.username = resp.username
                      this.authService.
                        tokenOauth2(this.userLogin.username, this.userLogin.password)
                          .subscribe({
                            next: (resp) => {
                              let strJson = JSON.stringify(resp)
                              let json = JSON.parse(strJson)
                              this.token = json.access_token
                              this.userLogin.token = this.token
                              environment.token = this.token
                              userToSave.token = this.token
                              this.authService
                                .updateUserLogged(environment.id, userToSave)
                                  .subscribe({
                                    next: (resp) => {
                                      environment.isLogged = true
                                      this.router.navigate(['/home'])
                                      this.alerts.showAlertSuccess("User Logged-in!")
                                      }
                                })
                            }
                          })
                    } else {
                      console.log("User never logged")
                      this.authService.
                        tokenOauth2(this.userLogin.username, this.userLogin.password)
                          .subscribe({
                            next: (resp) => {
                              let strJson = JSON.stringify(resp)
                              let json = JSON.parse(strJson)
                              this.token = json.access_token
                              this.userLogin.token = this.token
                              this.authService.getInfoFromUserUsername(this.userLogin.username)
                                .subscribe({
                                  next: (resp) => {
                                    environment.token = this.token
                                    environment.firstName = resp.firstName
                                    environment.lastName = resp.lastName
                                    environment.username = resp.email
                                    userToSave.firstname = resp.firstName
                                    userToSave.token = this.token
                                    this.authService
                                      .salvarLogin(userToSave)
                                        .subscribe({
                                          next: (resp) => {
                                            environment.isLogged = true
                                            environment.id = resp.id
                                            this.router.navigate(['/home'])
                                            this.alerts.showAlertSuccess("User Logged-in!")
                                          }
                                        })
                                  }
                                })
                            }
                          })
                    }
                  }
                })
            }
          }
        })
  }
}
