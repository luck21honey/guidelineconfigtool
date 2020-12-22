// Import the classes for NAVIFY Platform authentication
import {
    Auth
 } from '@dia/auth';

//Configuration
export const auth = new Auth({
    platform: {
        url:  "https://usw.api.appdevus.platform.navify.com" // Navify Platform URL
    },
    app: {
        url: "https://roche.authapp.appdevus.platform.navify.com", // Auth-UI URL
    },
    client: {
        /** Client application alias. */
        appAlias: 'fbb937f7-fd4d-4b0c-ab34-21ec77dd33c0',
        /** Client tenant alias. */
        tenantAlias: 'support-cds-ast'
    }
 }, {
    customPageTitle: 'CDS AST Authentication',
    customHeadline: '<strong>NAVIFY<sup>®</sup></strong> App Support Tool',
    customFooter: '<div class=""><a href="http://roche.com">Roche</a>CPS</div>',
 }
 );

