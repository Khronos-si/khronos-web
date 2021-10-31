# Vuexy - Vuejs, React, HTML & Laravel Admin Dashboard Template

# Kako pognati
install node_modules
komanda: **yarn**

poganjanje
komanda: **yarn run serve**

## Router
src\router\index.js
- meta.requiresAuth: boolean 
    -> true -> uporabnik mora biti prijavljen
    -> false -> ta stran ne potrebuje avtentikacije (npr login ali first page)
- meta.roles: ["array user rolov"]
    -> ['admin', 'user'] -> uporabnik mora biti ali **admin** ali **user** da lahko dostopa do strani
    -> [] ali nenastavljeno -> uporabnik ne potrebuje nobenega rola, da lahko dostopa
    -> ['superuser'] -> uporabnik mora biti **superuser**

## i18n oz. večjezičnost
src\i18n\i18nData.js

## dodajanje elementov v navbar na levi strani
src\navigation\vertical\index.js
- title -> naslov strani, že po defaultu je omogočen i18n
- route -> se mora ujemati z "name" property v routerju
- icon -> Ikona (https://vue-feather-icons.egoist.sh/)
- required_permission: ['role array']
    -> ['admin'] -> lahko vidi samo **admin**
    -> ['user', 'superuser'] -> lahko vidita samo **user** in **superuser**
    -> [] ali nenastavljeno -> vsakdo lahko vidi 

## preverjanje required_permission iz prejšnje točke
src\@core\layouts\layout-vertical\components\vertical-nav-menu\components\vertical-nav-menu-items\VerticalNavMenuItems.vue
- prilagodiš imena po svoji želji

## LOGIN page
- opisan postopek logina in pridobivanje in shranjevanje uporabniških podatkov

## Nastavljanje API URLja za vsak request narejen z axios (npr. this.$http.get('url') ali this.$http.post('url'))
src\axios.js