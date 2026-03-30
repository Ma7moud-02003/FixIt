export interface RegisetrModel
{
      name: string,
  email: string,
  phone: string,
  city: string,
  password: string,
  confirmPassword:string,
  role:'worker'|'client';
}
