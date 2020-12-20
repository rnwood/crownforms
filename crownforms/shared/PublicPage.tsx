import { observable } from "mobx";
import { Component, ReactNode } from "react";

export abstract class PublicPage<TProps> extends Component<TProps> {
  
  abstract renderTitle() : ReactNode;
  abstract renderBody() : ReactNode;

    render() {
      return <div>
                <header className="govuk-header " role="banner" data-module="govuk-header">
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-header__logo">
            <a href="/" className="govuk-header__link govuk-header__link--homepage">
              <span className="govuk-header__logotype">
                <img alt="GDFORMS" src="/logo.png"/>   
              </span>
            </a>
          </div>
          <div className="govuk-header__content">
        
        <div className="govuk-header__link govuk-header__link--service-name">
          {this.renderTitle()}
        </div>
        
        
        </div>
        </div>
      </header>
                <div className="govuk-width-container">
    
                    {this.renderPhase()}
    
                    <main className="govuk-main-wrapper govuk-body">
    
                      {this.renderBody()}
                    </main>
                </div>
                <footer className="govuk-footer " role="contentinfo">
        <div className="govuk-width-container ">
          <div className="govuk-footer__meta">
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
    
                        Powered by <a href='https://github.com/rnwood/crownforms' target='_new'>crownforms</a>
              
            </div>
            <div className="govuk-footer__meta-item">
              © Copyright
            </div>
          </div>
        </div>
      </footer>
            </div>
    }
    
  @observable
  protected phase: string|undefined;

  @observable phaseDescription: string|undefined;

  private renderPhase() {
    return this.phase && <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">
          {this.phase}
        </strong>
        <span className="govuk-phase-banner__text">{this.phaseDescription ?? ""}</span>
      </p>
    </div>;
  }
}