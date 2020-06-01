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
                    <a href="index.html" data-type="index-link">NgxEditor</a>
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
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter additional">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#additional-pages"'
                            : 'data-target="#xs-additional-pages"' }>
                            <span class="icon ion-ios-book"></span>
                            <span>Wiki</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="additional-pages"' : 'id="xs-additional-pages"' }>
                                    <li class="link ">
                                        <a href="additional-documentation/configuration.html" data-type="entity-link" data-context-id="additional">Configuration</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/ngmodel.html" data-type="entity-link" data-context-id="additional">NgModel</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/history.html" data-type="entity-link" data-context-id="additional">History</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/shortcuts.html" data-type="entity-link" data-context-id="additional">Shortcuts</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/html.html" data-type="entity-link" data-context-id="additional">HTML</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/menu-plugin.html" data-type="entity-link" data-context-id="additional">Menu Plugin</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/schema.html" data-type="entity-link" data-context-id="additional">Schema</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/inline-code-editor.html" data-type="entity-link" data-context-id="additional">Inline Code Editor</a>
                                    </li>
                                    <li class="link ">
                                        <a href="additional-documentation/input-rules.html" data-type="entity-link" data-context-id="additional">Input Rules</a>
                                    </li>
                        </ul>
                    </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/NgxEditorModule.html" data-type="entity-link">NgxEditorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NgxEditorModule-c246d7ddcaf4fa8190a7e01343c46a88"' : 'data-target="#xs-components-links-module-NgxEditorModule-c246d7ddcaf4fa8190a7e01343c46a88"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxEditorModule-c246d7ddcaf4fa8190a7e01343c46a88"' :
                                            'id="xs-components-links-module-NgxEditorModule-c246d7ddcaf4fa8190a7e01343c46a88"' }>
                                            <li class="link">
                                                <a href="components/NgxEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NgxEditorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/DropDownView.html" data-type="entity-link">DropDownView</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuBarView.html" data-type="entity-link">MenuBarView</a>
                            </li>
                            <li class="link">
                                <a href="classes/MenuItemView.html" data-type="entity-link">MenuItemView</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/NgxEditorService.html" data-type="entity-link">NgxEditorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NgxEditorServiceConfig.html" data-type="entity-link">NgxEditorServiceConfig</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/MenuItemMeta.html" data-type="entity-link">MenuItemMeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItemViewSpec.html" data-type="entity-link">MenuItemViewSpec</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuOptions.html" data-type="entity-link">MenuOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgxEditorConfig.html" data-type="entity-link">NgxEditorConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NodeViews.html" data-type="entity-link">NodeViews</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});