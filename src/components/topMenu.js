import React, { Component } from "react";
import "../App.css";
import { Icon, Button, Menu, Dropdown, AutoComplete, Switch } from "antd";
import { Transition } from "react-transition-group";
import { Link } from "react-router-dom";
class TopMenu extends Component {
  renderMenu = () => {
    const categories = ["NSFW", "SFW", "ART", "ANIMALS", "FOOD"];
    const menuItems = categories.map((category, key) => (
      <Menu.Item key={key}>
        <Button>
          <Link to={`/${category}`}>{category}</Link>
        </Button>
      </Menu.Item>
    ));
    return (
      <Menu theme="dark">
        <Menu.Item disabled>{this.props.category}</Menu.Item>
        <Menu.Divider />
        {menuItems}
        <Menu.Divider />
        <Menu.Item>
          Gif only:
          <Switch onChange={this.toggleGifsOnly} />
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    return (
      <div className="topMenuWrapper">
        <div className="searchWrapper">
          <Transition
            in={this.props.isSearchActivated}
            unmountOnExit
            mountOnEnter
            timeout={100}
          >
            {status => (
              <AutoComplete
                placeholder="Search here"
                autoFocus
                className={`autocomplete--${status}`}
                // dataSource={this.state.dataSource}
                onBlur={() => this.props.searchBoxOpenClose()}
                onSelect={this.props.onSelect}
                onSearch={this.props.handleSearch}
              />
            )}
          </Transition>

          <Transition
            in={!this.props.isSearchActivated}
            unmountOnExit
            mountOnEnter
            timeout={0}
          >
            {status => (
              <Button
                ghost
                className={`searchButton--${status}`}
                onClick={() => this.props.searchBoxOpenClose()}
              >
                <Icon type="search" />
              </Button>
            )}
          </Transition>
        </div>

        <h1 className="logo">sliddit.</h1>

        <Dropdown
          visible={this.props.isDropDownShowing}
          overlay={this.renderMenu()}
          onClick={this.props.showDropdown}
        >
          {this.props.isDropDownShowing ? (
            <Button ghost className="settings-icon">
              <Icon type="close" className="chooseCat" />
            </Button>
          ) : (
            <Button ghost className="settings-icon">
              <Icon type="setting" className="chooseCat" />
            </Button>
          )}
        </Dropdown>
      </div>
    );
  }
}

export default TopMenu;
