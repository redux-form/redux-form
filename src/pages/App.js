import React, {PropTypes, Component} from 'react';
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavItem, NavBrand, NavDropdown, MenuItem} from 'react-bootstrap';

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
            <NavBrand>
              <img src={require('./brand.png')} className={styles.brand}/> Redux Form
            </NavBrand>
          </IndexLinkContainer>
          <Nav pullRight>
            <NavDropdown title="Examples">
              <LinkContainer to="/simple"><MenuItem>Simple</MenuItem></LinkContainer>
              <LinkContainer to="/synchronous-validation"><MenuItem>Synchronous Validation</MenuItem></LinkContainer>
            </NavDropdown>
            <NavItem href="https://github.com/erikras/react-redux-universal-hot-example"
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
