import { RouterModule, Routes } from '@angular/router';
import { Register } from './Features/auth/register/register';
import { Login } from './Features/auth/login/login';
import { authGuardGuard } from './Core/Guards/auth-guard-guard';
import { Home } from './Features/home/home';
import { DashboaredLayout } from './Layouts/dashboared-layout/dashboared-layout';
import { Component } from '@angular/core';
import { MainLayout } from './Layouts/main-layout/main-layout';
import { Require } from './Features/Client/Requests/require/require';
import { MySendedServices } from './Features/Client/Requests/my-sended-services/my-sended-services';
import { roleGuard } from './Core/Guards/role-guard';
import { MyRecivedServices } from './Features/Workers/profile/my-recived-services/my-recived-services';
import { ServiceDetails } from './Features/service-details/service-details';
import { Profile } from './Shared/Components/profile/profile';
import { Search } from './Features/search/search';
import { UserProfile } from './Features/user-profile/user-profile';
import { AddPortfolio } from './Features/Workers/add-portfolio/addPortfolio';
import { Reviews } from './Features/reviews/reviews';
import { Portfolis } from './Features/Workers/portfolis/portfolis';


export const routes: Routes = [


    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: 'register', component: Register },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    {
        path: 'dashboared', canActivate: [authGuardGuard, roleGuard], data: { roles: ['worker'] },
        component: DashboaredLayout,
        children: [
            { path: 'recivedService', component: MyRecivedServices },
            { path: 'profile', component:Profile },
            { path: 'ser_details/:id', component: ServiceDetails },
            {path:'addPortfolio',component:AddPortfolio},
            {path:'myPortfolio',component:Portfolis},
            {path:'workerProfile/:workerId',component:UserProfile},
            {path:'reviews/:workerId',component:Reviews},
        ]

    },
    {
        path: 'mainLayout', canActivate: [authGuardGuard, roleGuard], data: { roles: ['client'] },
        component: MainLayout,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
            {path:'reviews/:workerId',component:Reviews},
            { path: 'profile', component:Profile },
            { path: 'require/:workerId', component: Require },
            { path: 'sendedServices', component: MySendedServices },
            { path: 'ser_details/:id', component: ServiceDetails },
            {path:'search',component:Search},
            {path:'myPortfolio/:workerId',component:Portfolis},
            {path:'workerProfile/:workerId',component:UserProfile}

        ]
    },
    { path: '**', redirectTo: 'register', pathMatch: 'full' }


    // {path:'home',component:Home}

];
