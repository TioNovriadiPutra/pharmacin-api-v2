/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  DoctorPolicy: () => import('#policies/doctor_policy'),
  UnitPolicy: () => import('#policies/unit_policy'),
  PatientPolicy: () => import('#policies/patient_policy'),
  QueuePolicy: () => import('#policies/queue_policy'),
  AuthPolicy: () => import('#policies/auth_policy'),
}
