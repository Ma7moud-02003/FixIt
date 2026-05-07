import { Routes } from '@angular/router';
import { authGuardGuard } from './Core/Guards/auth-guard-guard';
import { roleGuard } from './Core/Guards/role-guard';

export const routes: Routes = [
 
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  // ================= AUTH =================
  {
    path: 'register',
    loadComponent: () =>
      import('./Features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'reports/:userId',
    canActivate: [authGuardGuard],
    loadComponent: () =>
      import('./Features/Reports/add_reports/reports').then(m => m.Reports)
  },
  
  {
    path: 'login',
    loadComponent: () =>
      import('./Features/auth/login/login').then(m => m.Login)
  },

  // ================= HOME =================
  {
    path: 'home',
    loadComponent: () =>
      import('./Features/home/home').then(m => m.Home)
  },
  {
    path: 'my_notifs', canActivate: [authGuardGuard],
    loadComponent: () =>
      import('./Features/notifications/notifications').then(m => m.Notifications)
  },
  {
    path: 'chat/:workerId', canActivate: [authGuardGuard],
    loadComponent: () =>
      import('./Features/chat/chat').then(m => m.Chat)
  },

//===================Aamin===================

{
  path:'admin',canActivate:[authGuardGuard,roleGuard],
  data:{roles:['admin']},
  loadComponent:()=>import('./admin/admin-layout/admin-layout').then(m=>m.AdminLayout),
  children:[

{
  path:'',loadComponent:()=>import('./admin/components/dashboard/dashboard').then(m=>m.Dashboard)

},
{
  path:'users',loadComponent:()=>import('./admin/components/clinets/clinets').then(m=>m.Clinets)
  
},
{
  path:'workers',loadComponent:()=>import('./admin/components/workers/workers').then(m=>m.Workers)
  
},
{
  path:'catogs',loadComponent:()=>import('./admin/components/catogs/catogs').then(m=>m.Catogs)
  
},

{
  path:'',loadComponent:()=>import('./admin/components/dashboard/dashboard').then(m=>m.Dashboard)
  
}
  ]

},


  // ================= DASHBOARD (WORKER) =================
  {
    path: 'dashboared',
    canActivate: [authGuardGuard, roleGuard],
    data: { roles: ['worker'] },
    loadComponent: () =>
      import('./Layouts/dashboared-layout/dashboared-layout').then(m => m.DashboaredLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Features/Components/dashboared-home/dashboared-home')
            .then(m => m.DashboaredHome)
      },

      {
        path: 'myServices',
        loadComponent: () =>
          import('./Features/Components/my-services/my-services')
            .then(m => m.MyServices)
      },
     
       
      {
        path: 'profile',
        loadComponent: () =>
          import('./Shared/Components/profile/profile').then(m => m.Profile)
      },
      {
        path: 'ser_details/:id',
        loadComponent: () =>
          import('./Features/service-details/service-details').then(m => m.ServiceDetails)
      },
      {
        path: 'addPortfolio',
        loadComponent: () =>
          import('./Features/Workers/add-portfolio/addPortfolio').then(m => m.AddPortfolio)
      },
      {
        path: 'myPortfolio',
        loadComponent: () =>
          import('./Features/Workers/portfolis/portfolis').then(m => m.Portfolis)
      },
      {
        path: 'workerProfile/:workerId',
        loadComponent: () =>
          import('./Features/user-profile/user-profile').then(m => m.UserProfile)
      },
      {
        path: 'reviews/:workerId',
        loadComponent: () =>
          import('./Features/reviews/reviews').then(m => m.Reviews)
      },
    ]
  },

  // ================= MAIN (CLIENT) =================
  {
    path: 'mainLayout',
    canActivate: [authGuardGuard, roleGuard],
    data: { roles: ['client','worker'] },
    loadComponent: () =>
      import('./Layouts/main-layout/main-layout').then(m => m.MainLayout),
    children: [
{
        path: 'myServices',
        loadComponent: () =>
          import('./Features/Components/my-services/my-services')
            .then(m => m.MyServices)
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'myServices',
        loadComponent: () =>
          import('./Features/Components/my-services/my-services')
            .then(m => m.MyServices)
      },

      {
        path: 'home',
        loadComponent: () =>
          import('./Features/home/home').then(m => m.Home)
      },


      {
        path: 'profile',
        loadComponent: () =>
          import('./Shared/Components/profile/profile').then(m => m.Profile)
      },

      {
        path: 'require/:workerId',
        loadComponent: () =>
          import('./Features/Client/Requests/require/require').then(m => m.Require)
      },

      {
        path: 'ser_details/:id',
        loadComponent: () =>
          import('./Features/service-details/service-details').then(m => m.ServiceDetails)
      },

      {
        path: 'search',
        loadComponent: () =>
          import('./Features/search/search').then(m => m.Search)
      },

      {
        path: 'myPortfolio/:workerId',
        loadComponent: () =>
          import('./Features/Workers/portfolis/portfolis').then(m => m.Portfolis)
      },

      {
        path: 'my_favourites',
        loadComponent: () =>
          import('./Features/my-favorite/my-favorite').then(m => m.MyFavorite)
      },

      {
        path: 'workerProfile/:workerId',
        loadComponent: () =>
          import('./Features/user-profile/user-profile').then(m => m.UserProfile)
      },

      {
        path: 'reviews/:workerId',
        loadComponent: () =>
          import('./Features/reviews/reviews').then(m => m.Reviews)
      }

    ]
  },

  // ================= FALLBACK =================
  {
    path: '**',
    redirectTo: 'register'
  }

];