'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">project-name documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' :
                                            'id="xs-controllers-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' :
                                        'id="xs-injectables-links-module-AuthModule-65060b12c2f165beb126c572a475d76ea528dd38638f84dc3e126bae3d29ecb576406d2346542ef12d99e2a577c9abbefc264f05b9318c930eda36432f74506b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailProcessor.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailProcessor</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BrandModule.html" data-type="entity-link" >BrandModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' : 'data-bs-target="#xs-controllers-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' :
                                            'id="xs-controllers-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' }>
                                            <li class="link">
                                                <a href="controllers/BrandsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' : 'data-bs-target="#xs-injectables-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' :
                                        'id="xs-injectables-links-module-BrandModule-3ccec96be1f049868644f2733c2189f43b3f78c1ba63320f3af2b9bf223b46cce528de084ccdf23b661dee2f0d3c86237d751b6d6465970e9f92c40f9d3a3823"' }>
                                        <li class="link">
                                            <a href="injectables/BrandService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoryModule.html" data-type="entity-link" >CategoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' : 'data-bs-target="#xs-controllers-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' :
                                            'id="xs-controllers-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' }>
                                            <li class="link">
                                                <a href="controllers/CategoryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' : 'data-bs-target="#xs-injectables-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' :
                                        'id="xs-injectables-links-module-CategoryModule-dbd394f1d6ba5dcd43611c028bc8577f9783289d85c154df401bf1ad91402a0c13c99a798ef2a922f872d67313e74b56ef6857bc19e819b0efdab50fcc6ed056"' }>
                                        <li class="link">
                                            <a href="injectables/categoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >categoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CompanyModule.html" data-type="entity-link" >CompanyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' : 'data-bs-target="#xs-controllers-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' :
                                            'id="xs-controllers-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' }>
                                            <li class="link">
                                                <a href="controllers/CompanyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' : 'data-bs-target="#xs-injectables-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' :
                                        'id="xs-injectables-links-module-CompanyModule-6f991f89106290007cd8ff4e329e365f4363ee7713d19443f24f8e05c673a85fe04e0b39b84838b1b87b88db0e3966c6eb3b8bc50541a747182ebc299549db4c"' }>
                                        <li class="link">
                                            <a href="injectables/CompanyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomerModule.html" data-type="entity-link" >CustomerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' : 'data-bs-target="#xs-controllers-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' :
                                            'id="xs-controllers-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' }>
                                            <li class="link">
                                                <a href="controllers/CustomerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' : 'data-bs-target="#xs-injectables-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' :
                                        'id="xs-injectables-links-module-CustomerModule-b8092aa850ce1dcf5f44fe443a4d1e008418a767108595846b2bf669e00f2cc7b3a8c7030a603bcab6353e8f2528bc830adf0d957637bfa7962ab4e09f43c4a1"' }>
                                        <li class="link">
                                            <a href="injectables/CustomerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PermissionModules.html" data-type="entity-link" >PermissionModules</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' : 'data-bs-target="#xs-controllers-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' :
                                            'id="xs-controllers-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' }>
                                            <li class="link">
                                                <a href="controllers/PermissionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' : 'data-bs-target="#xs-injectables-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' :
                                        'id="xs-injectables-links-module-PermissionModules-0038fb4be5979ea32df7622b268c89ab71d426788349d79a26c76bda88c760e8c7a6de401e5c037b80b8fd449f0e92766278dcbda12c23c18efa2f9fd28aeef1"' }>
                                        <li class="link">
                                            <a href="injectables/PermissionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/productModule.html" data-type="entity-link" >productModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' : 'data-bs-target="#xs-controllers-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' :
                                            'id="xs-controllers-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' }>
                                            <li class="link">
                                                <a href="controllers/ProductController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' : 'data-bs-target="#xs-injectables-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' :
                                        'id="xs-injectables-links-module-productModule-dd1af1519bedad70b82308d86c6047c6a266b96e1d1b6e461b35ac767b7978b8cddcf997fd837aa3876bd1fb544c0fb77fe083b9753b0c0f8104add39701e682"' }>
                                        <li class="link">
                                            <a href="injectables/ProductService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/purchaseModule.html" data-type="entity-link" >purchaseModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' : 'data-bs-target="#xs-controllers-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' :
                                            'id="xs-controllers-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' }>
                                            <li class="link">
                                                <a href="controllers/PurchaseController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PurchaseController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' : 'data-bs-target="#xs-injectables-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' :
                                        'id="xs-injectables-links-module-purchaseModule-a756acc29b41b2b3c66926a34d2dfbd70426b4c81a70ea8920cfb44313676e78394c7bf258ce71018efee54cd78ae310d56b4d6e575979ffc8e1a847348084f0"' }>
                                        <li class="link">
                                            <a href="injectables/purchaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >purchaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReportModule.html" data-type="entity-link" >ReportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' : 'data-bs-target="#xs-controllers-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' :
                                            'id="xs-controllers-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' }>
                                            <li class="link">
                                                <a href="controllers/ReportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' : 'data-bs-target="#xs-injectables-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' :
                                        'id="xs-injectables-links-module-ReportModule-13f41d4f13d52d9629090ef19a9788a406a785ae477fa88aa64b660f755ca74982ceadb68ddacad5d7cff74ef346de3d9eef03b652923b3431d902c172cd8079"' }>
                                        <li class="link">
                                            <a href="injectables/ReportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RolesModule.html" data-type="entity-link" >RolesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' : 'data-bs-target="#xs-controllers-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' :
                                            'id="xs-controllers-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' }>
                                            <li class="link">
                                                <a href="controllers/RolesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' : 'data-bs-target="#xs-injectables-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' :
                                        'id="xs-injectables-links-module-RolesModule-8c121625b9aacc4f6002f28b115215c09f2507643fdf5e71e495e625bcc27f22a3d243aad4e2c3614873361d47185d2ac5444079234352bdf05cf5450b0d2d08"' }>
                                        <li class="link">
                                            <a href="injectables/RolesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/salesModule.html" data-type="entity-link" >salesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' : 'data-bs-target="#xs-controllers-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' :
                                            'id="xs-controllers-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' }>
                                            <li class="link">
                                                <a href="controllers/salesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >salesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' : 'data-bs-target="#xs-injectables-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' :
                                        'id="xs-injectables-links-module-salesModule-ce808fd5f59906c5134d905858ed12db02134a3074b74228cc4b026ae3231b90fa8a444af0cc443c3a1e1582d89ff9708264f1b484cb1544947676860f12b66c"' }>
                                        <li class="link">
                                            <a href="injectables/salesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >salesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/unitsModule.html" data-type="entity-link" >unitsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' : 'data-bs-target="#xs-controllers-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' :
                                            'id="xs-controllers-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' }>
                                            <li class="link">
                                                <a href="controllers/UnitsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnitsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' : 'data-bs-target="#xs-injectables-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' :
                                        'id="xs-injectables-links-module-unitsModule-03aef0b7b6cf39fcd85d68790c16970b96cf5135f6c3c0dc0f129c29f6e693cabe8d9f1bb3e815b2af7222d7736c7f89faf79540372749cb2fb6c6e3429f4f2a"' }>
                                        <li class="link">
                                            <a href="injectables/UnitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UnitService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModules.html" data-type="entity-link" >UserModules</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' : 'data-bs-target="#xs-controllers-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' :
                                            'id="xs-controllers-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' : 'data-bs-target="#xs-injectables-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' :
                                        'id="xs-injectables-links-module-UserModules-9a19f5d40e2cdcf5cf61a09faf0711f22414018b067b828bdffc9caeaf8825062fd725d2d2799f26de6d01f3375c998b3788bb519012294bd85405d81feeae4d"' }>
                                        <li class="link">
                                            <a href="injectables/EmailProcessor.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailProcessor</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VendorModule.html" data-type="entity-link" >VendorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' : 'data-bs-target="#xs-controllers-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' :
                                            'id="xs-controllers-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' }>
                                            <li class="link">
                                                <a href="controllers/VendorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' : 'data-bs-target="#xs-injectables-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' :
                                        'id="xs-injectables-links-module-VendorModule-64d17a359f6a19c621b9ce8cd2a1e845b975d89b978776181da309a7b3c3627b60d3c3478d128419efc53fb0f4921571f1319550dea964702b1c82377b47d4bc"' }>
                                        <li class="link">
                                            <a href="injectables/VendorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VendorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BrandsController.html" data-type="entity-link" >BrandsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CategoryController.html" data-type="entity-link" >CategoryController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CompanyController.html" data-type="entity-link" >CompanyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CustomerController.html" data-type="entity-link" >CustomerController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PermissionController.html" data-type="entity-link" >PermissionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductController.html" data-type="entity-link" >ProductController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PurchaseController.html" data-type="entity-link" >PurchaseController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReportController.html" data-type="entity-link" >ReportController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RolesController.html" data-type="entity-link" >RolesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/salesController.html" data-type="entity-link" >salesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UnitsController.html" data-type="entity-link" >UnitsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/VendorController.html" data-type="entity-link" >VendorController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/BaseEntities.html" data-type="entity-link" >BaseEntities</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Brands.html" data-type="entity-link" >Brands</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Category.html" data-type="entity-link" >Category</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Companies.html" data-type="entity-link" >Companies</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Customer.html" data-type="entity-link" >Customer</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Notification.html" data-type="entity-link" >Notification</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Payment.html" data-type="entity-link" >Payment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Permission.html" data-type="entity-link" >Permission</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PurchaseDetails.html" data-type="entity-link" >PurchaseDetails</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PurchaseItem.html" data-type="entity-link" >PurchaseItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PurchaseReturnDetails.html" data-type="entity-link" >PurchaseReturnDetails</a>
                                </li>
                                <li class="link">
                                    <a href="entities/purchaseReturnItem.html" data-type="entity-link" >purchaseReturnItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Refund.html" data-type="entity-link" >Refund</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Roles.html" data-type="entity-link" >Roles</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SalesDetails.html" data-type="entity-link" >SalesDetails</a>
                                </li>
                                <li class="link">
                                    <a href="entities/salesItem.html" data-type="entity-link" >salesItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SalesReturnDetails.html" data-type="entity-link" >SalesReturnDetails</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SalesReturnItem.html" data-type="entity-link" >SalesReturnItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Units.html" data-type="entity-link" >Units</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Users.html" data-type="entity-link" >Users</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Vendor.html" data-type="entity-link" >Vendor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/addBrandDto.html" data-type="entity-link" >addBrandDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddProductDto.html" data-type="entity-link" >AddProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddUsersDto.html" data-type="entity-link" >AddUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/baseDto.html" data-type="entity-link" >baseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/baseUpdateDto.html" data-type="entity-link" >baseUpdateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/baseUpdateUserDto.html" data-type="entity-link" >baseUpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/changeForgetPasswordDto.html" data-type="entity-link" >changeForgetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/changeMyPassword.html" data-type="entity-link" >changeMyPassword</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangeUserPasswordDto.html" data-type="entity-link" >ChangeUserPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryDto.html" data-type="entity-link" >CreateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCompanyDto.html" data-type="entity-link" >CreateCompanyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCustomerDto.html" data-type="entity-link" >CreateCustomerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePermissionDto.html" data-type="entity-link" >CreatePermissionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoleDto.html" data-type="entity-link" >CreateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/createSalesItemDto.html" data-type="entity-link" >createSalesItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/createUnitsDto.html" data-type="entity-link" >createUnitsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/createUserDto.html" data-type="entity-link" >createUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateVendor.html" data-type="entity-link" >CreateVendor</a>
                            </li>
                            <li class="link">
                                <a href="classes/forgetPasswordDto.html" data-type="entity-link" >forgetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PurchaseDetail.html" data-type="entity-link" >PurchaseDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/PurchaseItemDto.html" data-type="entity-link" >PurchaseItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PurchasePaymentDTO.html" data-type="entity-link" >PurchasePaymentDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SalesDetailsDto.html" data-type="entity-link" >SalesDetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SalesPaymentDTO.html" data-type="entity-link" >SalesPaymentDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignupDto.html" data-type="entity-link" >SignupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBrandDto.html" data-type="entity-link" >UpdateBrandDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCategoryDto.html" data-type="entity-link" >UpdateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCompanyDto.html" data-type="entity-link" >UpdateCompanyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/updateCustomerDto.html" data-type="entity-link" >updateCustomerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/updatePayment.html" data-type="entity-link" >updatePayment</a>
                            </li>
                            <li class="link">
                                <a href="classes/updatePayment-1.html" data-type="entity-link" >updatePayment</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProdcutDtos.html" data-type="entity-link" >UpdateProdcutDtos</a>
                            </li>
                            <li class="link">
                                <a href="classes/updatePurchase.html" data-type="entity-link" >updatePurchase</a>
                            </li>
                            <li class="link">
                                <a href="classes/updatePurchaseItem.html" data-type="entity-link" >updatePurchaseItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRoleDto.html" data-type="entity-link" >UpdateRoleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/updateSales.html" data-type="entity-link" >updateSales</a>
                            </li>
                            <li class="link">
                                <a href="classes/updateSalesItem.html" data-type="entity-link" >updateSalesItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUnitDto.html" data-type="entity-link" >UpdateUnitDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/updateVendor.html" data-type="entity-link" >updateVendor</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BrandService.html" data-type="entity-link" >BrandService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/categoryService.html" data-type="entity-link" >categoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CompanyService.html" data-type="entity-link" >CompanyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomerService.html" data-type="entity-link" >CustomerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailProcessor.html" data-type="entity-link" >EmailProcessor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PermissionService.html" data-type="entity-link" >PermissionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/purchaseService.html" data-type="entity-link" >purchaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReportService.html" data-type="entity-link" >ReportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RolesService.html" data-type="entity-link" >RolesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/salesService.html" data-type="entity-link" >salesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UnitService.html" data-type="entity-link" >UnitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VendorService.html" data-type="entity-link" >VendorService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AllUserCanAccess.html" data-type="entity-link" >AllUserCanAccess</a>
                            </li>
                            <li class="link">
                                <a href="guards/canAccess.html" data-type="entity-link" >canAccess</a>
                            </li>
                            <li class="link">
                                <a href="guards/havePermissionGuards.html" data-type="entity-link" >havePermissionGuards</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});