export default [
  {
    title: 'general.home',
    route: 'home',
    icon: 'HomeIcon'
    // required_permission: ['admin']
    // če dodaš array required_permission, se bodo na levi strani v navbaru izrisovali samo routi,
    // z dovoljenimi permissioni
    // koda ki to dejansko preverja se nahaja v: 
    // src\@core\layouts\layout-vertical\components\vertical-nav-menu\components\vertical-nav-menu-items\VerticalNavMenuItems.vue
  },
  {
    title: 'general.second_page',
    route: 'second-page',
    icon: 'FileIcon'
    // required_permission: ['superuser', 'user']
  }
]
