import React, {PropTypes, Component} from 'react';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem} from 'react-bootstrap';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.any
  }

  render() {
    const styles = require('./App.scss');
    return (
      <div>
        <Navbar fixedTop>
          <IndexLinkContainer to="/">
            <NavbarBrand>
              <img src={require('./brand.png')} className={styles.brand}/> Redux Form
            </NavbarBrand>
          </IndexLinkContainer>
          <Nav pullRight>
            <LinkContainer to="/getting-started"><MenuItem>Getting Started</MenuItem></LinkContainer>
            <LinkContainer to="/faq"><MenuItem>FAQ</MenuItem></LinkContainer>
            <NavDropdown title="API" id="examples-dropdown">
              <LinkContainer to="/api"><MenuItem>API</MenuItem></LinkContainer>
              <LinkContainer to="/api/reduxForm"><MenuItem><code>reduxForm()</code></MenuItem></LinkContainer>
              <LinkContainer to="/api/reducer"><MenuItem><code>reducer</code></MenuItem></LinkContainer>
              <LinkContainer to="/api/reducer/normalize"><MenuItem><code>reducer.normalize()</code></MenuItem></LinkContainer>
              <LinkContainer to="/api/reducer/plugin"><MenuItem><code>reducer.plugin()</code></MenuItem></LinkContainer>
              <LinkContainer to="/api/props"><MenuItem><code>props</code></MenuItem></LinkContainer>
              <LinkContainer to="/api/action-creators"><MenuItem>Action Creators</MenuItem></LinkContainer>
            </NavDropdown>
            <NavDropdown title="Examples" id="examples-dropdown">
              <LinkContainer to="/examples"><MenuItem>All Examples</MenuItem></LinkContainer>
              <LinkContainer to="/examples/simple"><MenuItem>Simple</MenuItem></LinkContainer>
              <LinkContainer to="/examples/synchronous-validation"><MenuItem>Synchronous Validation</MenuItem></LinkContainer>
              <LinkContainer to="/examples/submit-validation"><MenuItem>Submit Validation</MenuItem></LinkContainer>
              <LinkContainer to="/examples/asynchronous-blur-validation"><MenuItem>Asynchronous Blur Validation</MenuItem></LinkContainer>
              <LinkContainer to="/examples/initializing-from-state"><MenuItem>Initializing From State</MenuItem></LinkContainer>
              <LinkContainer to="/examples/dynamic"><MenuItem>Dynamic Forms</MenuItem></LinkContainer>
              <LinkContainer to="/examples/multirecord"><MenuItem>Multirecord Forms</MenuItem></LinkContainer>
              <LinkContainer to="/examples/normalizing"><MenuItem>Normalizing Form Values</MenuItem></LinkContainer>
              <LinkContainer to="/examples/alternate-mount-point"><MenuItem>Alternate Redux Mount Point</MenuItem></LinkContainer>
            </NavDropdown>
            <NavItem href="https://github.com/erikras/redux-form"
                     className={styles.iconLink}
                     target="_blank" title="View on Github"><i className="fa fa-github"/></NavItem>
          </Nav>
        </Navbar>
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <Navbar fixedBottom className={styles.bottom}>
          Have questions? Ask for help <a
          href="https://github.com/erikras/redux-form/issues"
          target="_blank">on Github</a> or in the <a
          href="https://discordapp.com/channels/102860784329052160/105736485537374208"
          target="_blank">#redux-form</a> Discord channel.
        </Navbar>
      </div>
    );
  }
}
